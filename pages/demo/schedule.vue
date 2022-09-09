<template>
    <div>
        <h3>schedule vue</h3>
        <TForm v-model="data" :fields="schema"   />
        <TInputEvent />
    </div>
</template>

<script>
    import TForm from '~/components/TForm.vue';
    import TInputEvent from '~/components/TInput/TInputEvent.vue';

export default {
    components: {
    TForm,
    TInputEvent,
}, 
    data() {
        return {
            data : {
                name: 'Salsa Party', 
                schedule: [
                    {
                    name: 'Check-in',
                    startDate: '2022-08-16 19:00',
                    endDate: '2022-08-16 20:00',
                    description: '',
                    },
                    {
                    name: 'Doors close',
                    startDate: '2022-08-16 23:59',
                    description: '',
                    },
                 ],          
            },
            schema: [
                    {
                        name: 'name',
                        component: 'TInput',
                    },
                    {
                        name: 'schedule',
                        component: 'TInputArray',
                        children: {
                        component: 'TInputEvent',
                        },
                        label: 'Schedule',
                        labelPosition: 'top',
                    },
                ]
        }
    }
}
</script>

<style>

</style>