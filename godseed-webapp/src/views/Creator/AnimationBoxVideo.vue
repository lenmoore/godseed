<template>
    <div class="video-wrapper">
        animation box video

        <div class='video-container'>
            <video v-for="video in videos" :key="video.id" :src="video.URL" class='video' id="localVideo" autoplay loop></video>
         </div>

    </div>
</template>

<script>
export default {
    props: {
        videos: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style>
.video-wrapper {
    width: 600px;
    height: 600px;
    border: 1px solid green;
}

.video-container {
    position:relative;
}
.video {
    width: 600px;
    height: 600px;
    float: left;
    border:5px solid orange;
    position: absolute;
}

</style>