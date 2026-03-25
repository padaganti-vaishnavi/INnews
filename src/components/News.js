import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from './Spinner'

export class News extends Component {

  static defaultProps = {
    country: 'in',
    category: 'general',
    pageSize: 9
  }

  static propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number,
    apiKey: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `INnews - ${this.props.category}`
  }

  async componentDidMount() {
    await this.updateNews()
  }

  updateNews = async () => {
    try {
      this.setState({ loading: true })

      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`

      const data = await fetch(url)
      const parsedData = await data.json()

      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0,
        loading: false
      })
    } catch (error) {
      console.error("Error fetching news:", error)
      this.setState({ loading: false })
    }
  }

  fetchMoreData = async () => {
    try {
      const nextPage = this.state.page + 1

      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`

      const data = await fetch(url)
      const parsedData = await data.json()

      this.setState({
        page: nextPage,
        articles: this.state.articles.concat(parsedData.articles || []),
        totalResults: parsedData.totalResults || this.state.totalResults
      })
    } catch (error) {
      console.error("Error loading more news:", error)
    }
  }

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">
          INnews - Top {this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)} Headlines
        </h1>

        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="row">
            {this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : "No Title"}
                  des={element.description ? element.description.slice(0, 90) : "No Description"}
                  imgurl={element.urlToImage}
                  newsurl={element.url}
                  author={element.author || "Unknown"}
                  date={element.publishedAt}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>

        {this.state.articles.length === 0 && !this.state.loading && (
          <p className="text-center mt-4">No news articles found.</p>
        )}
      </div>
    )
  }
}

export default News
