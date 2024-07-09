<template>
    <div>
        <h1>Configure Parameters</h1>
        <form>
            <label>
                <input type="checkbox" v-model="params.option1" />
                Option 1
            </label>
            <label>
                <input type="checkbox" v-model="params.option2" />
                Option 2
            </label>
            <!-- Add more checkboxes as needed -->
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: {
                option1: false,
                option2: false
            }
        };
    }
};
</script>
