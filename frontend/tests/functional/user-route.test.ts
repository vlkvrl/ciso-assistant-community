import { LoginPage } from '../utils/login-page.js';
import { test, expect, setHttpResponsesListener, TestContent } from '../utils/test-utils.js';
import { m } from '$paraglide/messages';
const vars = TestContent.generateTestVars();

test('user usual routine actions are working correctly', async ({
	logedPage,
	pages,
	analyticsPage,
	sideBar,
	page
}) => {
	test.slow();

	await page.waitForLoadState('networkidle');
	const modalBackdrop = page.getByTestId('modal-backdrop');

	await test.step('Dismiss any blocking modals', async () => {
		if (await modalBackdrop.isVisible()) {
			await modalBackdrop.press('Escape');
			await expect(modalBackdrop).not.toBeVisible();
		}

		if (await page.locator('#driver-dummy-element').isVisible()) {
			await page.locator('.driver-popover-close-btn').first().click();
		}
	});

	// Attempt to close any remaining modals
	await page.locator('body').press('Escape');

	await test.step('proper redirection to the analytics page after login', async () => {
		await analyticsPage.hasUrl();
		await analyticsPage.hasTitle();
		setHttpResponsesListener(page);
	});

	await test.step('user can create a domain', async () => {
		await sideBar.click('Organization', pages.foldersPage.url);
		await pages.foldersPage.hasUrl();
		await pages.foldersPage.hasTitle();

		await pages.foldersPage.createItem({
			name: vars.folderName,
			description: vars.description
		});

		//TODO assert that the domain data are displayed in the table
	});

	await test.step('user can create a perimeter', async () => {
		await sideBar.click('Organization', pages.perimetersPage.url);
		await pages.perimetersPage.hasUrl();
		await pages.perimetersPage.hasTitle();

		await pages.perimetersPage.createItem({
			name: vars.perimeterName,
			description: vars.description,
			folder: vars.folderName,
			ref_id: 'R.1234',
			lc_status: 'Production'
		});

		//TODO assert that the perimeter data are displayed in the table
	});

	await test.step('user can create an asset', async () => {
		await sideBar.click('Assetsmanagement', pages.assetsPage.url);
		await pages.assetsPage.hasUrl();
		await pages.assetsPage.hasTitle();

		await pages.assetsPage.createItem({
			name: vars.assetName,
			description: vars.description,
			folder: vars.folderName,
			type: 'Primary'
		});

		//TODO assert that the asset data are displayed in the table
	});

	await test.step('user can import a framework', async () => {
		await sideBar.click('Catalog', pages.frameworksPage.url);
		await pages.frameworksPage.hasUrl();
		await pages.frameworksPage.hasTitle();

		await pages.frameworksPage.addButton.click();
		await pages.librariesPage.hasTitle();
		await pages.librariesPage.hasTitle();

		await pages.librariesPage.importLibrary(vars.framework.ref, vars.framework.urn);

		await sideBar.click('Catalog', pages.frameworksPage.url);
		await pages.frameworksPage.hasUrl();
		await expect(page.getByRole('row', { name: vars.framework.name })).toBeVisible();
	});

	await test.step('user can create a reference control', async () => {
		await sideBar.click('Catalog', pages.referenceControlsPage.url);
		await pages.referenceControlsPage.hasUrl();
		await pages.referenceControlsPage.hasTitle();

		await pages.referenceControlsPage.createItem({
			name: vars.referenceControlName,
			description: vars.description,
			category: 'Physical',
			csf_function: 'protect',
			provider: 'Test provider',
			folder: vars.folderName
		});

		//TODO assert that the reference control data are displayed in the table
	});

	await test.step('user can create an applied control', async () => {
		await sideBar.click('Operations', pages.appliedControlsPage.url);
		await pages.appliedControlsPage.hasUrl();
		await pages.appliedControlsPage.hasTitle();

		await pages.appliedControlsPage.createItem({
			name: vars.appliedControlName,
			description: vars.description,
			category: 'Technical',
			csf_function: 'protect',
			status: 'To do',
			eta: '2025-01-01',
			link: 'https://intuitem.com/',
			effort: 'Large',
			cost: 24.42,
			folder: vars.folderName,
			reference_control: `${vars.folderName}/${vars.referenceControlName}`
		});

		//TODO assert that the applied control data are displayed in the table
	});

	await test.step('user can create a security exception', async () => {
		await sideBar.click('Governance', pages.securityExceptionsPage.url);
		await pages.securityExceptionsPage.hasUrl();
		await pages.securityExceptionsPage.hasTitle();

		await pages.securityExceptionsPage.createItem({
			name: vars.securityExceptionName,
			description: vars.description,
			ref_id: '123456',
			status: 'Draft',
			expiration_date: '2100-01-01',
			folder: vars.folderName,
			owners: [LoginPage.defaultEmail],
			approver: LoginPage.defaultEmail
		});
	});

	await test.step('user can create a compliance assessment', async () => {
		await sideBar.click('Compliance', pages.complianceAssessmentsPage.url);
		await pages.complianceAssessmentsPage.hasUrl();
		await pages.complianceAssessmentsPage.hasTitle();

		await pages.complianceAssessmentsPage.createItem({
			name: vars.assessmentName,
			description: vars.description,
			perimeter: vars.folderName + '/' + vars.perimeterName,
			version: '1.4.2',
			status: 'Done',
			framework: vars.framework.name,
			eta: '2025-01-01',
			due_date: '2025-05-01'
		});

		//TODO assert that the compliance assessment data are displayed in the table
	});

	await test.step('user can create an evidence', async () => {
		await sideBar.click('Compliance', pages.evidencesPage.url);
		await pages.evidencesPage.hasUrl();
		await pages.evidencesPage.hasTitle();

		await pages.evidencesPage.createItem({
			name: vars.evidenceName,
			description: vars.description,
			attachment: vars.file,
			folder: vars.folderName,
			link: 'https://intuitem.com/'
		});

		//TODO assert that the evidence data are displayed in the table
	});

	await test.step('user can import a risk matrix', async () => {
		await sideBar.click('Catalog', pages.riskMatricesPage.url);
		await pages.riskMatricesPage.hasUrl();
		await pages.riskMatricesPage.hasTitle();

		await pages.riskMatricesPage.addButton.click();
		await pages.librariesPage.hasUrl(true, '/libraries?object_type=risk_matrix');
		await pages.librariesPage.hasTitle();

		await pages.librariesPage.importLibrary(vars.matrix.name, vars.matrix.urn);

		await sideBar.click('Catalog', pages.riskMatricesPage.url);
		await pages.riskMatricesPage.hasUrl();
		await expect(page.getByRole('row', { name: vars.matrix.displayName })).toBeVisible();
	});

	await test.step('user can create a risk assessment', async () => {
		await sideBar.click('Risk', pages.riskAssessmentsPage.url);
		await pages.riskAssessmentsPage.hasUrl();
		await pages.riskAssessmentsPage.hasTitle();

		await pages.riskAssessmentsPage.createItem({
			name: vars.riskAssessmentName,
			description: vars.description,
			perimeter: vars.folderName + '/' + vars.perimeterName,
			version: vars.riskAssessmentVersion,
			status: 'Done',
			risk_matrix: vars.matrix.displayName
		});

		//TODO assert that the risk assessment data are displayed in the table
	});

	await test.step('user can create a threat', async () => {
		await sideBar.click('Catalog', pages.threatsPage.url);
		await pages.threatsPage.hasUrl();
		await pages.threatsPage.hasTitle();

		await pages.threatsPage.createItem({
			name: vars.threatName,
			description: vars.description,
			folder: vars.folderName,
			provider: 'Test provider'
		});

		//TODO assert that the threat data are displayed in the table
	});

	await test.step('user can create a risk scenario', async () => {
		await sideBar.click('Risk', pages.riskScenariosPage.url);
		await pages.riskScenariosPage.hasUrl();
		await pages.riskScenariosPage.hasTitle();

		await pages.riskScenariosPage.createItem({
			name: vars.riskScenarioName,
			description: vars.description,
			risk_assessment: `${vars.folderName}/${vars.perimeterName}/${vars.riskAssessmentName} - ${vars.riskAssessmentVersion}`,
			threats: [`${vars.folderName}/${vars.threatName}`]
		});

		//TODO assert that the risk scenario data are displayed in the table
	});

	await test.step('user can create a risk acceptance', async () => {
		await sideBar.click('Governance', pages.riskAcceptancesPage.url);
		await pages.riskAcceptancesPage.hasUrl();
		await pages.riskAcceptancesPage.hasTitle();

		await pages.riskAcceptancesPage.createItem({
			name: vars.riskAcceptanceName,
			description: vars.description,
			expiry_date: '2025-01-01',
			folder: vars.folderName,
			approver: LoginPage.defaultEmail,
			risk_scenarios: [
				`${vars.folderName}/${vars.perimeterName}/${vars.riskAssessmentName} - ${vars.riskAssessmentVersion}/${vars.riskScenarioName}`
			]
		});

		//TODO assert that the risk acceptance data are displayed in the table
	});

	await test.step('user can add another user', async () => {
		await sideBar.click('Organization', pages.usersPage.url);
		await pages.usersPage.hasUrl();
		await pages.usersPage.hasTitle();

		await pages.usersPage.createItem({
			email: vars.user.email
		});

		//TODO assert that the user data are displayed in the table
	});
});

test.afterEach('cleanup', async ({ foldersPage, usersPage, page }) => {
	await foldersPage.goto();
	await foldersPage.deleteItemButton(vars.folderName).click();
	await expect(foldersPage.deletePromptConfirmTextField()).toBeVisible();
	await foldersPage.deletePromptConfirmTextField().fill(m.yes());
	await foldersPage.deletePromptConfirmButton().click();
	await expect(foldersPage.getRow(vars.folderName)).not.toBeVisible();

	await usersPage.goto();
	await usersPage.deleteItemButton(vars.user.email).click();
	await usersPage.deleteModalConfirmButton.click();
	await expect(usersPage.getRow(vars.user.email)).not.toBeVisible();
});
