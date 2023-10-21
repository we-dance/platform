<template>
  <div>
    <p :class="textClass">200 Free Cards Left</p>
    <button type="button" :class="buttonClass">
      <a href="https://wedance.gumroad.com/l/vip-card">Get Free VIP Card</a>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonClass: 'button',
      textClass: 'text',
    }
  },
}
</script>

<style>
.text {
  font-size: 1.5em;
  text-align: center;
}
.button {
  background-color: black;
  border: none;
  color: white;
  padding: 13px 200px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 3px 4px 20px;
  cursor: pointer;
  border-radius: 20px;
}

@media screen and (max-width: 600px) {
  .text {
    font-size: 1em;
    text-align: center;
  }
  .button {
    padding: 10px 100px;
    margin: 20px 20px 15px 60px;
    font-size: 10px;
  }
}
</style>
