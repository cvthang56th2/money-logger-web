<script setup>
</script>

<template>
  <div class="h-[100svh] flex flex-col">
    <header class="border-b-2 flex-0 relative px-4">
      <div class="flex lg:justify-center text-xl md:text-2xl lg:text-3xl py-2 font-bold">
        Money Logger
      </div>
    </header>
    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.border-1px {
  border-width: 1px;
}

.custom-select .vs__selected {
  margin: 0;
  padding: 0;
}
.custom-select .vs__dropdown-toggle {
  padding-bottom: 0;
}
.custom-select .vs__search {
  margin-top: 0;
}
.custom-select,
.custom-select .vs__selected-options,
.custom-select > .vs__dropdown {
  height: 26px;
}
.custom-select .vs__actions {
  display: none;
}
.flex-0 {
  flex-shrink: 0;
  flex-grow: 0;
}
</style>