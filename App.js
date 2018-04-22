import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  AppState
} from 'react-native';

import axios from 'axios';

//Hi monghol!!!

import { checkLogin, doLogin, doLogout } from './internet';

const current = '';

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super()

    this.state = {
      nameValue: '',
      secretValue: '',
      isLoggedIn: false,
      loading: false,
      appState: AppState.currentState
    };
  }
  fixingLoginForm(username) {
    if (username.includes('@aut.ac.ir')) {
      return (username.substring(0, username.indexOf('@aut.ac.ir'))).toLowerCase();
    }
    else{
      return username.toLowerCase();
    }
  }
  async storeUsername(username) {
      await AsyncStorage.setItem('username', username);
  }

  async storePassword(password) {
    await AsyncStorage.setItem('password', password);
  }

  async getUsername() {
    try {
      let token = await AsyncStorage.getItem('username');
      return token;
    }
    catch (error){
      Alert.alert(error);
    }
  }

  async getPassword() {
    try {
      let token = await AsyncStorage.getItem('password');
      return token;
    }
    catch (error){
      Alert.alert(error);
    }
  }

  _handleNameChange = nameValue => {
    this.setState({ nameValue });
  };
  
  _handleSecretChange = secretValue => {
    this.setState({ secretValue });
  };

  _handleLoginPress = async () => {
    this.setState({isLoading: true});
    try {
      const username = this.state.nameValue;
      const password = this.state.secretValue;
      username = this.fixingLoginForm(username);
      await doLogin(username, password);
      
      await this.checkLogin();
   

      if (this.state.isLoggedIn){
      await this.storeUsername(username);
      await this.storePassword(password);
      } else {
        Alert.alert('خطا هنگام ورود‍')
      }
    }
    catch (e) {
      console.log(e + '');
    }
  };
  
  _handleLogoutPress = async () => {
    try {
      
      const logout = await doLogout();

      this.setState({ isLoggedIn: logout });
      this.setState({isLoading: false});

      if (logout) {
        Alert.alert("خروج شما انجام نشد :)");
      }

    }
    catch (e) {
      console.log(e + '');
    }
  };

  
  async componentWillMount() {
    const user = await this.getUsername();
    const pass = await this.getPassword();
    this.setState({nameValue: user, secretValue: pass});
    this._handleLoginPress();
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    await this.checkLogin();
  }

  async checkLogin() {
    this.setState({isLoading: true});
    const success = await checkLogin();
    this.setState({ isLoggedIn: success, isLoading: false });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground!
      await this.checkLogin();
    }
    this.setState({appState: nextAppState});
  }

  render(state) {

    if (this.state.isLoading) {
      return <ImageBackground style={styles.container}  source={require("./assets/background.png")}>
       <ActivityIndicator size="large" color="#007269" />
       <TouchableOpacity 
            onPress={() => this.setState({ isLoading: false })}
            style={{marginBottom: 30}}
        >
        <ImageBackground style={[styles.button, {marginTop: 30}]} source={require("./assets/logout.png")}>
        <Text style={styles.font}>
           انصراف 
        </Text>
        </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>

    }

    if (this.state.isLoggedIn) {
      return  (
      <View style={{flex: 1, }}>
        <View style={{backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',}}>
        <Text style={[styles.font, {alignItems: 'center',justifyContent: 'center', fontSize: 10}]}>
        https://github.com/daghighi1376
        </Text>
        <Text style={[styles.font, {alignItems: 'center',justifyContent: 'center',}]}>
          https://github.com/authq/aut-login-app
        </Text>
        </View>
        <ImageBackground style={styles.container}  source={require("./assets/background.png")}>
          <Text style={styles.font}>شما به اکانت اینترنت خود وارد شدید</Text>
          <TouchableOpacity 
              onPress={() => this._handleLogoutPress()}
              style={{marginBottom: 30}}
          >
          <ImageBackground style={[styles.button, {marginTop: 30}]} source={require("./assets/logout.png")}>
          <Text style={styles.font}>
            خروج
          </Text>
          </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      )
    }

    else {

    return (
      <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}  source={require("./assets/background.png")}>
          <TextInput
            value={this.state.nameValue}
            onChangeText={this._handleNameChange}
            style={{ width: 200, height: 44, padding: 8, textAlign :'center', marginBottom:10, fontFamily: 'IRANSansMobile' }}
            placeholder= 'ایمیل'
            placeholderTextColo='#bababa'
          />

          <TextInput
            value={this.state.secretValue}
            onChangeText={this._handleSecretChange}
            style={{ width: 200, height: 44, padding: 8, textAlign :'center', marginTop:10, marginBottom:20 }}
            secureTextEntry={true}
            placeholder='رمز ورود'
            placeholderTextColo='#bababa'
          />
                      
            <TouchableOpacity style={styles.button}
						  onPress={() => this._handleLoginPress()}
						  activeOpacity={1} >
                <ImageBackground style={styles.button} source={require("./assets/login.png")}>
								  <Text style={styles.font}>ورود</Text>
                </ImageBackground>
					</TouchableOpacity>
          </ImageBackground>
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
		justifyContent: 'center',
    zIndex: 100,
    height: 37.5,
    width: 75,
  },
  font: {
    fontFamily: 'IRANSansMobile',
  }
});
