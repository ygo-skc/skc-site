import { NAME_maps_ROUTE } from '../Routes'


function handleFetch(endPoint, history, onJsonReceived) {
	fetch(endPoint)
		.then((data) => {
			if (data.ok) return data.json()
			else
			{
				const err = new Error(data.statusText)
				err.name = data.status
				throw err
			}
		})
		.then(onJsonReceived)
		.catch((err) => handleRedirect(err, history))
}


function handleRedirect(err, history)
{
	history.push(NAME_maps_ROUTE[err.name])
}


export { handleFetch }