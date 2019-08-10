
function handleFetchErrRedirect(context, status, redirect='generic')
{
	console.log(status)
	context.props.history.push(redirect)
}

export default handleFetchErrRedirect