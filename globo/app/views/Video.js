import React from 'react';
import { Text, View, FlatList, Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

export class Video extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { listLoaded: false }
  }



  async getYoutubeVideos() {
    try {
      const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=pluralsight&key=AIzaSyDTzRqxq4Mm0cInB9CFAGtrJjS0OuGnKAU');
      const responseJson = await response.json();
      if (responseJson.items) {
        this.setState({
          listLoaded: true,
          videoList: Array.from(responseJson.items)
        });
      }
      else {
        console.error('no data');
        console.error(responseJson);
      }
    }
    catch (err) {
      console.error('error');
      console.error(err);
    }
      
  }

  componentDidMount() {
    /*return fetch(
      'https://www.googleapis.com/youtube/v3/search?part=snippet&q=pluralsight&key=AIzaSyDTzRqxq4Mm0cInB9CFAGtrJjS0OuGnKAU'
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.items) {
          this.setState({
            listLoaded: true,
            videoList: Array.from(responseJson.items)
          });
        }
        else {
          console.error(responseJson);
        }
      })
      .catch((error) => {
        console.error(error);
      });*/

    try {
      this.getYoutubeVideos();
    }
    catch(error) {
      console.error(error);
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.state.listLoaded && (
          <View style={{ paddingTop: 30 }}>
            <FlatList
              data={this.state.videoList}
              renderItem={({ item }) =>
                <TubeItem
                  navigate={navigate}
                  id={item.id.videoId}
                  title={item.snippet.title}
                  imageSrc={item.snippet.thumbnails.high.url}
                />
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

        {!this.state.listLoaded && (
          <View >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading ...</Text>
          </View>
        )}

      </View>
    );
  }
}

export class TubeItem extends React.Component {

  onPress = () => {
    if (this.props.id) {
      this.props.navigate('VideoDetailRT', { ytubeId: this.props.id });
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={{ paddingTop: 20, alignItems: 'center' }}>
          <Image
            style={{ width: '100%', height: 200 }}
            source={{ uri: this.props.imageSrc }}
          />
          <Text>
            {this.props.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
