import React, { Component } from 'react'
import '../styles.css'

class Pictures extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            per: 3,
            page: 1,
            total_pages: null,
            scrolling: false
        }
    }

    componentDidMount() {
        this.loadUser();
        this.scrollListener = window.addEventListener('scroll', (e) => {
            this.handleScroll(e);
        });
    }

    loadUser = () => {
        const { per, page, data } = this.state;
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=` + process.env.REACT_APP_FLICKR_API_KEY + `&tags=nature&per_page=${per}&page=${page}&format=json&nojsoncallback=1`;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    data: [...data, ...json.photos.photo],
                    scrolling: false,
                    total_pages: json.photos.total
                })
            });
    };

    loadMore = () => {
        this.setState(
            prevState => ({
                page: prevState.page + 1,
                scrolling: true
            }),
            this.loadUser
        );
    };

    handleScroll = (e) => {
        const { scrolling, total_pages, page } = this.state;
        if (scrolling) return;
        if (total_pages <= page) return;
        const lastLi = document.querySelector('tbody > tr:last-child');
        const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        var bottomOffset = 20;
        if (pageOffset > lastLiOffset - bottomOffset) {
            this.loadMore();
        }
    };

    render() {
        return (
            <div className="container" >
                <table className="table">
                    <thead>
                        <tr>
                            <th className="firstCol" scope="col"><h2>PICTURE</h2></th>
                            <th className="secondCol" scope="col"><h2 className="title">TITLE</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((data, index) => {
                            let srcPath = 'https://farm' + data.farm + '.staticflickr.com/' + data.server + '/' + data.id + '_' + data.secret + '.jpg';
                            let picTitle = data.title.toUpperCase();
                            return (
                                <tr key={index}>
                                    <td className="firstCol"><img alt="pics" src={srcPath}></img></td>
                                    <td className="secondCol"><h1>{picTitle}</h1></td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Pictures;