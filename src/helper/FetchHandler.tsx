import axios, { AxiosError, AxiosResponse } from 'axios'
// import { NAME_maps_ROUTE } from '../Routes'
// import { useNavigate } from 'react-router-dom'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID as string

function handleFetch(endPoint: string, onJsonReceived: {(res: any): void}) {
	axios
		.get(endPoint, {
			headers: {
				'CLIENT_ID': CLIENT_ID
			}
		})
		.then((res: AxiosResponse) => {
			if (res.status === 200) return res.data
			else
			{
				const err = new Error(res.statusText)
				err.name = res.status.toString()
				throw err
			}
		})
		.then(onJsonReceived)
		.catch((err) => handleRedirect(err) )
}


function handleRedirect(err: AxiosError)
{
	// const navigate = useNavigate()

	if ( err.name === 'TypeError' )
	{
		// navigate(NAME_maps_ROUTE[503])
	}
	// navigate(NAME_maps_ROUTE[err.name])
}


export { handleFetch }