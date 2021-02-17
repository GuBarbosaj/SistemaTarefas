package com.brickup.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brickup.model.Tarefa;

//Interface que fornece os métodos para as operações CRUD de maneira automatizada. Através da extensão da
//interface JpaRepository.
public interface TarefaRepository extends JpaRepository<Tarefa, Long>{

}
