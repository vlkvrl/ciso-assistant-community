import { defaultDeleteFormAction, defaultWriteFormAction } from '$lib/utils/actions';
import { BASE_API_URL } from '$lib/utils/constants';
import { getModelInfo } from '$lib/utils/crud';
import { modelSchema } from '$lib/utils/schemas';
import { listViewFields } from '$lib/utils/table';
import type { ModelInfo, urlModel } from '$lib/utils/types';
import { type TableSource } from '@skeletonlabs/skeleton-svelte';
import { type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const schema = z.object({ id: z.string().uuid() });
	const deleteForm = await superValidate(zod(schema));
	const URLModel = 'feared-events';
	const createSchema = modelSchema(URLModel);
	const objectEndpoint = `${BASE_API_URL}/ebios-rm/studies/${params.id}/object/`;
	const objectResponse = await fetch(objectEndpoint);
	let object: any = {};
	if (objectResponse.ok) {
		object = await objectResponse.json();
	} else {
		console.error(`Failed to fetch study object: ${objectResponse.statusText}`);
	}

	const initialData = {
		ebios_rm_study: params.id,
		folder: object.folder
	};
	const createForm = await superValidate(initialData, zod(createSchema), { errors: false });
	const model: ModelInfo = getModelInfo(URLModel);

	const selectOptions: Record<string, any> = {};

	const gravityChoicesEndpoint = `${BASE_API_URL}/ebios-rm/studies/${params.id}/gravity/`;
	const gravityChoicesResponse = await fetch(gravityChoicesEndpoint);

	if (gravityChoicesResponse.ok) {
		selectOptions['gravity'] = await gravityChoicesResponse.json().then((data) =>
			Object.entries(data).map(([key, value]) => ({
				label: value,
				value: parseInt(key)
			}))
		);
	} else {
		console.error(`Failed to fetch data for gravity: ${gravityChoicesResponse.statusText}`);
	}

	model['selectOptions'] = selectOptions;

	const headData: Record<string, string> = listViewFields[URLModel as urlModel].body.reduce(
		(obj, key, index) => {
			obj[key] = listViewFields[URLModel as urlModel].head[index];
			return obj;
		},
		{}
	);

	const table: TableSource = {
		head: headData,
		body: [],
		meta: []
	};

	return { createForm, deleteForm, model, URLModel, table };
};

export const actions: Actions = {
	create: async (event) => {
		// const redirectToWrittenObject = Boolean(event.params.model === 'entity-assessments');
		return defaultWriteFormAction({
			event,
			urlModel: 'feared-events',
			action: 'create'
			// redirectToWrittenObject: redirectToWrittenObject
		});
	},
	delete: async (event) => {
		return defaultDeleteFormAction({ event, urlModel: 'feared-events' });
	}
};
