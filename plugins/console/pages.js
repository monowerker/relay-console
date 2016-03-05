exports = module.exports = {
  relayPage: (request, reply, context) => {
    reply.view('relay', {
      pageTitle: context.pageTitle,
      relay1: {
        state: context.relayState.relay1
      },
      relay2: {
        state: context.relayState.relay2
      }
    });
  }
}