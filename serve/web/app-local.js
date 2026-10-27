/* Fork-local companion to app.js, loaded after it: carries only what the fork needs, so nothing
   here can conflict with upstream.

   The kit anchors .st-toasts to the bottom-right corner, and at a phone width that corner is the
   composer's: one toast covers the Send button, two cover the input field too. theme-local.css
   lifts the stack by the composer's own height instead - and that height is not a constant, since
   app.js autosizes the textarea as the draft grows and shows an attachment row. So it is measured
   and published as a custom property at the moments that can change it: typing (input bubbles from
   the textarea, after app.js has resized it), the attachment row, and the chat view being shown or
   hidden. The ResizeObserver is the catch-all for anything else. */
const composerWrap = document.querySelector(".composer-wrap");
if (composerWrap) {
  const publish = () => document.documentElement.style.setProperty("--composer-h", `${composerWrap.offsetHeight}px`);
  const watch = new MutationObserver(publish);
  const attachments = document.getElementById("attachments");
  if (attachments) watch.observe(attachments, {childList: true, attributes: true, attributeFilter: ["hidden"]});
  document.querySelectorAll(".view").forEach((v) => watch.observe(v, {attributes: true, attributeFilter: ["hidden"]}));
  document.addEventListener("input", publish);
  new ResizeObserver(publish).observe(composerWrap);
  publish();                              // the resting height, before any of the above fires
}

/* The chat view's visible height less the room the chat's own bottom padding already gives below the last
   row, for theme-local.css: a streaming answer reserves this much space under itself so its first line can
   sit at the top of the view while the text fills in below. clientHeight of the scroll container is the
   visible height - it is set by the layout (header, composer, keyboard), so it moves with the on-screen
   keyboard, tab switches and rotation, which is what the observer is for. */
const chatScroll = document.getElementById("chat-scroll");
if (chatScroll) {
  const publishView = () => {
    const chat = document.getElementById("chat");
    const pad = chat ? parseFloat(getComputedStyle(chat).paddingBottom) || 0 : 0;
    document.documentElement.style.setProperty("--chat-fill", `${chatScroll.clientHeight - pad}px`);
  };
  new ResizeObserver(publishView).observe(chatScroll);
  publishView();
}
