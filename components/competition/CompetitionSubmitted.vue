<template>
  <div class="flex justify-center items-center">
    <div class="p-4 flex flex-col items-center gap-4">
      <TIcon name="success" />

      <h1 class="text-3xl font-extrabold text-center">
        Video Uploaded Successfully!
      </h1>
      <div class="text-center text-xl text-gray-700 mb-4">
        Your video has been successfully uploaded and submitted for the
        competition. The voting period begins on August 15th. You will receive a
        notification once voting opens. In the meantime, prepare to share your
        video link and encourage others to vote for you when the time comes.
      </div>
      <div class="flex justify-center py-4">
        <TButton type="primary" to="/competition/"
          >Return to Competition</TButton
        >
      </div>
    </div>
  </div>
</template>
