<template>
  <div>
    <i v-if="isElIcon" :class="icon" class="sub-el-icon" />
    <svg-icon v-else :icon-class="icon" />
    <slot v-if="title" name="title">{{ title }}</slot>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    isElIcon() {
      return this.icon.includes("el-icon") ? true : false;
    }
  }
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
