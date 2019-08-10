import React, { Component } from 'react'

class ServerError extends Component
{
	render()
	{
		return(
			<div>
				<p>Server error</p>
				<p>Return <a href='/'>Home</a></p>
			</div>

		)
	}
}


export default ServerError