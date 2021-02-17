import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

//url da API Rest desenvolvida
const url="http://localhost:8080/tarefas/";


class App extends Component {
  state={
    data:[],
    modalInserir: false,
    modalEliminar: false,
    pagina: 'todas',
    form:{
      id: '',
      nome: '',
      estado: '',
      tipoModal: ''
    }
  }

  //Metodo que recupera todas as tarefas cadastradas no banco, via requisão GET na API
  recuperarTarefas=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  //Metodo que insere a tarefa no banco, via requisão POST na API
  inserirTarefa=async()=>{
    delete this.state.form.id;
    //Toda nova tarefa cadastrada recebe o atributo 'Pendente' no campo 'estado'
    this.state.form.estado = 'Pendente';
    await axios.post(url,this.state.form).then(response=>{
      this.modalInserir();
      this.recuperarTarefas();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  //Metodo que deleta a tarefa no banco, via requisão DELEtE na API, passando o ID da tarefa no corpo requisição
  deletarTarefa=()=>{
    axios.delete(url+this.state.form.id).then(response=>{
      this.setState({modalEliminar: false});
      this.recuperarTarefas();
    })
  }

  //Metodo que inverte o valor da flag responsavel por exibir o modal de inserção de novos dados
  modalInserir=()=>{
    this.setState({modalInserir: !this.state.modalInserir});
  }

  //Metodo responsavel por pegar as informações da tarefa selecionada
  selecionarTarefa=(tarefa)=>{
    this.setState({
      form: {
        id: tarefa.id,
        nome: tarefa.nome,
        estado: tarefa.estado
      }
    })
  }

  //Metodo que atualiza o valor das variaves a cada alteração no input
  handleChange=async e=>{
  e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  //Metodo utilizado para atualizar o DOM após uma nova alteração
  componentDidMount() {
    this.recuperarTarefas();
  }
  

  render(){
    const {form}=this.state;
    return (
      <div className="App">
        <br />
        <h1 className="display-4">Desafio BrickUp</h1>
        <br /><br />
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" onClick={()=>{this.setState({form: null, pagina: 'todas'})}}>Todas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onClick={()=>{this.setState({form: null, pagina: 'pendentes'})}}>Pendentes</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" onClick={()=>{this.setState({form: null, pagina: 'realizadas'})}}>Realizadas</a>
              </li>
            </ul>
          </div>
        </nav>
      
        <br />
        <button className="btn btn-success mb-3" onClick={()=>{this.setState({form: null, tipoModal: 'inserir'}); this.modalInserir()}}>Inserir nova tarefa</button>
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tarefa</th>
              <th>Status</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {this.state.pagina == 'todas' && this.state.data.map(tarefa=>{
              return(
                <tr>
                  <td>{tarefa.id}</td>
                  <td>{tarefa.nome}</td>
                  <td>{tarefa.estado}</td>
                  <td>
                    <button className="btn btn-danger" onClick={()=>{this.selecionarTarefa(tarefa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
            {this.state.pagina == 'pendentes' && this.state.data.map(tarefa=>{
              return(
                tarefa.estado == 'Pendente' && <tr>
                  <td>{tarefa.id}</td>
                  <td>{tarefa.nome}</td>
                  <td>{tarefa.estado}</td>
                  <td>
                    <button className="btn btn-danger" onClick={()=>{this.selecionarTarefa(tarefa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
            {this.state.pagina == 'realizadas' && this.state.data.map(tarefa=>{
              return(
                tarefa.estado == 'Finalizada' && <tr>
                  <td>{tarefa.id}</td>
                  <td>{tarefa.nome}</td>
                  <td>{tarefa.estado}</td>
                  <td>
                    <button className="btn btn-danger" onClick={()=>{this.selecionarTarefa(tarefa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
      </table>

      <Modal isOpen={this.state.modalInserir}>
          <ModalHeader style={{display: 'block'}}>
            Inserir tarefa
            <span style={{float: 'right'}} onClick={()=>this.modalInserir()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="nome">Tarefa</label>
              <input className="form-control" type="text" name="nome" id="nome" onChange={this.handleChange} value={form?form.nome: ''}/>
              <br />
              <label htmlFor="estado">Status</label>
              <input className="form-control" type="text" name="estado" id="estado" readOnly value={form?form.estado: 'Pendente'}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={()=>this.inserirTarefa()}>Inserir</button>
            <button className="btn btn-danger" onClick={()=>this.modalInserir()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Deseja remover essa tarefa?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.deletarTarefa()}>Sim</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>Nao</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  } 
}
export default App;
