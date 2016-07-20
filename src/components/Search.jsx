import React, { Component } from 'react'

import ResultsContainer from './ResultsContainer'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = { query: '', data: {}, inputCleared: false }
  }

  handleChange (event) {
    const query = event.target.value.trim().toLowerCase()

    // Don't duplicate searches or send redundant network requests
    if (this.state.query === query) {
      return
    }

    this.setState({ query })
    this.submitSearch(query)
  }

  submitSearch (keyword) {
    // If the keyword isn't present, set the data object to an empty object and
    // set a flag that the input has been cleared so we don't render any
    // pending AJAX requests after the user clears the input box
    if (!keyword.length > 0) {
      this.setState({ data: {}, inputCleared: true })
      return
    }

    // If a keyword was present, make sure the inputCleared flag is set to false
    this.setState({ inputCleared: false })

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(keyword)}&type=album,artist,track`

    $.getJSON(url, function (data) {
      // If the input field has been cleared or if Spotify returned an empty response,
      // don't render these results
      if (this.state.inputCleared || !data) {
        return
      }

      this.setState({ data })
    }.bind(this))
  }

  render () {
    return (
      <div>
        <div className="search-container">
          <input type="text" className="search-bar" onChange={this.handleChange.bind(this)} />
        </div>
        <div>
          <ResultsContainer data={this.state.data} />
        </div>
      </div>
    )
  }
}
