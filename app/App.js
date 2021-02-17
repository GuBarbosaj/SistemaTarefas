import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator,TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';

//Url da API Rest desenvolvida
const url = "http://192.168.2.2:8080/tarefas/";

export default class App extends Component{
  constructor(){
    super();
    this.state = {
      carregado: false,
      data: []
    }
  }


  //Metodo utilizado para atualizar o app após uma nova alteração
  componentDidMount(){
    fetch(url).then((resposta) => resposta.json())
    .then((respostaJson) =>{
      this.setState({
        carregado: false,
        data: respostaJson
      })
    })
  }

  ///Metodo utilizado para atualizar o estado da tarefa para finalizada
  FinalizarTarefa=(idTarefa, nomeTarefa)=>{
    axios.put(url+idTarefa, {nome: nomeTarefa, estado: "Finalizada"})
    Alert.alert('Sucesso','Tarefa finalizada!', [
      { text: "OK", onPress: () => this.componentDidMount() }
    ],
    { cancelable: false })
  }

  ///Metodo utilizado para renderizar cada registro de tarefa obtido atras da requisão GET
  _renderItem = ({item}) => (
    item.estado == 'Pendente' && <TouchableOpacity onPress={() => this.FinalizarTarefa(item.id, item.nome)}>
      <View style={styles.item}>
        <Text>{item.nome}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    if(this.state.carregado){
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" animating/>
        </View>
      );  
    }else{
      return (
        <View style={styles.container}>
          <Text style={styles.titulo}>Lista de tarefas pendentes</Text>
            <FlatList
              data={this.state.data}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index}
            />
        </View>
      );  
    }
  }
}

//Configurações de estilo do App
const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor: "#CCC",
    flexGrow: 1,
    margin: 4,
    padding: 20
  },
  titulo: {
    paddingTop:20,
    fontSize:40,
  },
});
