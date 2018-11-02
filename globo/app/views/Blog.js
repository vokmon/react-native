import React from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import HTML from 'react-native-render-html';

export class Blog extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = { blogLoaded: false };
  }

  async getPosts() {
    try {
      const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/myglobomantics.wordpress.com/posts');
      const responseJson = await response.json();
      this.setState({
        blogLoaded: true,
        blogList: Array.from(responseJson.posts)
      });
    }
    catch(error) {
      console.error(error);
    }
  }

  componentDidMount() {
    // return fetch('https://public-api.wordpress.com/rest/v1.1/sites/myglobomantics.wordpress.com/posts')
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   this.setState({
    //     blogLoaded: true,
    //     blogList: Array.from(responseJson.posts)
    //   });
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    this.getPosts();
  }

  chooseBlog = (blogID) => {
    this.props.navigation.navigate('BlogDetailRT', {blogId: blogID});
  }

  render() {
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        { this.state.blogLoaded && (
          <View style={{padding: 10}}>
            <FlatList 
              data={this.state.blogList}
              keyExtractor={(item, index) => item.ID.toString()}
              renderItem={({item}) =>
                <BlogItem
                  id={item.ID}
                  title={item.title}
                  imageSrc={item.featured_image}
                  excerpt={item.excerpt}
                  choosePost={this.chooseBlog}
                />
              }
            />
          </View>
        )}

        { !this.state.blogLoaded && (
          <View >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading ...</Text>
          </View>
        )}
      </View>
    );
  }
}

export class BlogItem extends React.Component {

  blogChoice = ()=> {
    this.props.choosePost(this.props.id);
  }

  render() {
    let blogItem = `
      <a href=${this.props.id} style="textDecorationLine: none; color: #000000; textAlign: center">
        <img src=${this.props.imageSrc} />
        <h1>${this.props.title}</h1>
        ${this.props.excerpt}
      </a>
    `;

    return (
      <View style={{borderBottomWidth: 2, borderBottomColor: '#000000', borderStyle: 'solid' }} >
        <HTML html={blogItem} onLinkPress={()=> this.blogChoice()} />
      </View>
    )
  }
}