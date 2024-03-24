<template>
  <div class="transition-all duration-300 ease-in-out" :class="modelValue ? 'opacity-1' : 'opacity-0'">
    <div v-if="modelValue" class="fixed bg-[rgba(0,0,0,.5)] inset-0 z-50 outline-none focus:outline-none items-center flex justify-center shadow-xl" @click="persistent && hide()">
      <div class="relative my-6 mx-auto max-w-[95svw] overflow-auto bg-white flex flex-col rounded-md shadow-lg" :style="`width: ${width}`" @click.stop>
        <!--header-->
        <div class="p-4 pr-8 border-b border-solid border-slate-200 rounded-t relative flex-0">
          <slot name="title">
            <h4 class="text-2xl font-semibold">
              {{ title }}
            </h4>
          </slot>
          <button v-if="!hideXbutton" class="text-5xl font-bold text-red-500 hover:text-black ease-linear transition-all duration-150 absolute top-1 md:top-[-16px] right-0" @click="hide()">
            ×
          </button>
        </div>
        <slot name="top-body"></slot>
        <!--body-->
        <div class="relative flex-1 overflow-y-auto max-h-[calc(100svh_-_200px)] lg:max-h-[calc(100svh_-_150px)]">
          <slot />
        </div>
        <!--footer-->
        <div class="border-t-2 text-center flex-0">
          <slot name="buttons">
            <button class="bg-green-500 text-white hover:bg-green-700 background-transparent font-bold uppercase py-3 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 w-full rounded-b" type="button" @click="onClickSave()">
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "large-modal",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    hideXbutton: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '80%'
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    confirmText: {
      type: String,
      default: 'Xác nhận'
    },
    save: {
      type: Function,
      default: () => (() => {})
    },
    persistent: {
      type: Boolean,
      default: false
    },
    closeOnSave: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    hide() {
      this.$emit('hide')
    },
    onClickSave () {
      if (typeof this.save === 'function') {
        this.save()
      }
      if (this.closeOnSave) {
        this.hide()
      }
    }
  }
}
</script>