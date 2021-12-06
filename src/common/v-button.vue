<template>
  <button
      :class="[
      $attrs.class,
      'button',
      {
        'is-loading': loading,
        'is-rounded': rounded,
        'is-outlined': outlined,
        'is-disabled': $attrs.disabled,
      },
      size,
      color,
    ]"

  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'v-button',
  data() {
    return {}
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    stateButton: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: 'button',
    },
    size: {
      type: String,
      validator: function (value) {
        return ['is-small', 'is-normal', 'is-medium', 'is-large'].includes(value)
      },
      default: 'is-normal',
    },
    color: {
      type: String,
      validator: function (value) {
        return [
          'is-primary',
          'is-link',
          'is-info',
          'is-success',
          'is-warning',
          'is-danger',
        ].includes(value)
      },
      default: 'is-primary',
    },
  },
}
</script>

<style scoped></style>