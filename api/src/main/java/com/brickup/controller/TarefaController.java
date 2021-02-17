package com.brickup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brickup.model.Tarefa;
import com.brickup.repository.TarefaRepository;
/*Classe responsável por expor cada requisição dispónivel na API Rest
 * Sendo elas:
 * 	Listar todos as tarefas - @GetMapping(“/tarefas")
	Remover uma tarefa pelo ID - @GetMapping(“>@DeleteMapping(“/tarefas/{id}”)
	Criar uma nova tarefa - @GetMapping(“/tarefas>@PostMapping(“/tarefas)
	Atualizar detalhes de uma tarefa - @GetMapping(“>@PutMapping(“/tarefas/{id}”)
 */

@RestController
@RequestMapping({"/tarefas"})
public class TarefaController {
	private TarefaRepository repository;
	
	TarefaController(TarefaRepository tarefaRepository){
		this.repository = tarefaRepository;
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping
	public List<Tarefa> findAll(){
	   return repository.findAll();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping
	public Tarefa create(@RequestBody Tarefa tarefa){
	   return repository.save(tarefa);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@DeleteMapping(path ={"/{id}"})
	public ResponseEntity <?> delete(@PathVariable long id) {
	   return repository.findById(id)
	           .map(record -> {
	               repository.deleteById(id);
	               return ResponseEntity.ok().build();
	           }).orElse(ResponseEntity.notFound().build());
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PutMapping(value="/{id}")
	public ResponseEntity <?> update(@PathVariable("id") long id, @RequestBody Tarefa tarefa) {
	   return repository.findById(id)
	           .map(record -> {
	               record.setNome(tarefa.getNome());
	               record.setEstado(tarefa.getEstado());
	               Tarefa atualizado = repository.save(record);
	               return ResponseEntity.ok().body(atualizado);
	           }).orElse(ResponseEntity.notFound().build());
	}
}
