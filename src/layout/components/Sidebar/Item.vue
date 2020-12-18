<template>
<div>

  <component v-bind:is="formatIcon()" v-bind="$attrs" />
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
  methods: {
    formatIcon() {
      const vnodes = [];
      if (this.icon) {
        if (this.icon.includes("el-icon")) {
          vnodes.push(<i class={[this.icon, "sub-el-icon"]} />);
        } else {
          vnodes.push(<svg-icon icon-class={this.icon} />);
        }
      }
      if (this.title) {
        vnodes.push(<span slot="title">{this.title}</span>);
      }
      return vnodes;
    }
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
