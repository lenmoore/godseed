<template>
    <div>
        <div>
<!--            <video height="400" width="400" autoplay src="src/assets/animations/contemporary/bear.mov"></video>-->

            <AnimationBoxVideo :videos="videos" />
            <h1>HELLO</h1>
        </div>
    </div>
</template>
<script  >
import AnimationBox from '@/views/Player/AnimationBox.vue'
import AnimationBoxVideo from '@/views/Creator/AnimationBoxVideo.vue'

export default {
    components: { AnimationBoxVideo, AnimationBox },

    data() {
        return {
            videos: [
                {
                    id: 2,
                    URL: 'src/assets/animations/contemporary/yoga_park/tree_walk.mov'
                },
            ]
        }
    }

}
</script>