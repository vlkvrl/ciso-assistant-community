<script lang="ts">
	import ModelForm from '$lib/components/Forms/ModelForm.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="card p-4 bg-white shadow-lg">
	<ModelForm
		form={data.form}
		object={data.object}
		selectOptions={data.selectOptions}
		foreignKeys={data.foreignKeys}
		model={data.model}
		context="edit"
	/>
</div>
