import React from 'react';
import { Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import HTML from 'react-native-render-html';

export class BlogDetail extends React.Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = { postLoaded: false };
  };

  async getBlogDetail () {
    try {
      const blogId = this.props.navigation.getParam('blogId', 'NO BLOG');
      const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/myglobomantics.wordpress.com/posts/${blogId}`)
      const responseJson = await response.json();
      this.setState({
        postLoaded: true,
        postTitle: responseJson.title,
        postImage: responseJson.featured_image,
        postContent: responseJson.content,
        postID: responseJson.ID
      });
    }
    catch(error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getBlogDetail();
    // const blogId = this.props.navigation.getParam('blogId', 'NO BLOG');
    // return fetch(`https://public-api.wordpress.com/rest/v1.1/sites/myglobomantics.wordpress.com/posts/${blogId}`)
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   this.setState({
    //     postLoaded: true,
    //     postTitle: responseJson.title,
    //     postImage: responseJson.featured_image,
    //     postContent: responseJson.content,
    //     postID: responseJson.ID
    //   });
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }

  goBack=() => {
    this.props.navigation.navigate('BlogRT');
  }

  render() {
    const blogTagStyles = {
      // hide image in the content
      img: { display: 'none' },
    }

    const blogClassStyles = {
      blTitle: { marginLeft: 'auto', marginRight: 'auto' },
      blContent: { marginLeft: 10, marginRight: 10 },
      blBack: { marginLeft: 'auto', marginRight: 'auto', paddingBottom: 20 }
    }

    const postDetails = `
      <div class="blTitle">
        <h1>${this.state.postTitle}</h1>
      </div>

      <div class="blContent">
        ${this.state.postContent}
      </div>

      <div class="blBack">
        <a href=${this.state.postID} style="textDecorationList: none; color: #000000">
          <h2>GO BACK</h2>
        </a>
      </div>
    `

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        { this.state.postLoaded && (
          <ScrollView>
            <Image 
              style={{width: '100%', height: 200 }}
              source={{ uri: this.state.postImage }}  
            />
            <HTML
              html={postDetails}
              tagsStyles={blogTagStyles}
              classesStyles={blogClassStyles}
              onLinkPress={ ()=> this.goBack() }
            />
          </ScrollView>
        )}

        { !this.state.postLoaded && (
          <View >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading ...</Text>
          </View>
        )}
      </View>
    );
  }
}