Initialize slider by sending post request here:
http://rest.learncode.academy/api/user1ab75/collection

post body (raw json): { num: 0 }

make additional post requests to test mulitiple sliders

moving slider dispatches two redux actions: one to immediately update state value, and one debounced action that makes an api post request to save slider value

refreshing page should pull in latest slider state
