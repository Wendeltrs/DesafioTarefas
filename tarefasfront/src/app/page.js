'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { IoIosAddCircleOutline } from 'react-icons/io'
import { MdOutlineDeleteOutline } from "react-icons/md"
import { FaRegCircle } from "react-icons/fa"


export default function Home() {
  // Cria variável e ao mesmo tempo função que define/seta seu valor
  const [tasks, setTasks] = useState(null)
  const [taskName, setTaskName] = useState('')
  const [count, setCount] = useState(0)

  // Função de buscar tarefas
  async function getTasks() {
    let response = await fetch('http://localhost:3333/task');
    let data = await response.json()
    return setTasks(data)
  }

  // Função de criar tarefa pegando o valor do nome da task
  async function createTask() {
    const url = "http://localhost:3333/task";
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tarefa: taskName }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      await getTasks();

      return response;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Função de deletar tarefa pelo id da tarefa
  async function deleteTask(taskId) {
    const url = `http://localhost:3333/task/${taskId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      await getTasks();

      return response;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Roda apenas uma vez durante o carregamento da página
  useEffect(() => {
    getTasks()
  }, [])
 
  // Enquanto o backend não devolver as tarefas retorna carregando para o usuário
  if (!tasks) return <div>Carregando...</div>

  return (
    <div className={styles.page}>
      <body className={styles.body}>
        <div className={ styles.logoRocket }>
          <Image
            src="/rocket.png"
            alt="rocket toDoo"
            width={22}
            height={36}
            priority
            className={ styles.imageRocket }
          />
          <span>to</span>
          <span style={{ color: '#5E60CE'}}>do</span>
        </div>

        <div className={ styles.divInputButton }>
          <input type="text" placeholder="Adicione uma nova tarefa" className={ styles.input } onChange={() => setTaskName(event.target.value)}/>
          {/** 
           * Este botão invoca a função createTask ao clicá-lo.
           * Além disso desabilita o botão caso o nome da tarefa seja vazio no input (permite espaço)
           */}
          <button className={ styles.button } onClick={() => createTask()} disabled={!taskName}>Criar <IoIosAddCircleOutline size={16}/> </button>
        </div>
        
        <ol className={ styles.ol }>
          {/** 
           * É um ternário onde caso não tenha task exibe a frase
           */}
          {tasks.length > 0 ?
           // Este map é basicamente a mesma coisa que um forEach porém de um jeito novo com algumas peculiaridades
            <div className={ styles.task }>
              <div style={{ display: 'flex' }}>
                <span className={ styles.span1 }>
                  Tarefas criadas 
                  <span className={ styles.span2 }>{tasks.length}</span>
                </span> 
                
                <span className={ styles.spanConcluidas }>
                  Concluídas 
                  <span className={ styles.span2WithConstent }>{`${count} de ${tasks.length}`}</span>
                </span>                          
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', }}>{tasks.map((task) => (
                  <li className={ styles.li } key={task.id}>
                    <span className={ styles.select } onClick={() => setCount(count + 1)} ><FaRegCircle fontSize={20}/></span>

                    <span style={{ width: '632px' , fontSize: '14px', fontWeight: '400', lineHeight: '19.6px', textAlign: 'left', color: 'rgba(242, 242, 242, 1)' }}>{task.tarefa}</span>

                    <span className={ styles.delete } onClick={() => deleteTask(task.id)}><MdOutlineDeleteOutline fontSize={20}/></span>
                  </li>
              ))} </div> 
            </div> :
            <div className={ styles.task }>
              <div style={{ display: 'flex' }}>
                <span className={ styles.span1 }>
                  Tarefas criadas 
                  <span className={ styles.span2 }>0</span>
                </span> 

                <span style={{ display: 'flex', gap: '8px', color: '#5E60CE', marginLeft: 'auto' }}>
                  Concluídas 
                  <span className={ styles.span2 }>0</span>
                </span>                          
              </div>

              <div className={ styles.clipboard }>
                <Image
                  src="/Clipboard.png"
                  alt="rocket toDoo"
                  width={56}
                  height={56}
                />

                <p className={ styles.p }>
                  Você ainda não tem tarefas cadastradas <br/>
                  <span style={{ fontWeight: '40' }}>
                      Crie tarefas e organize seus itens a fazer
                  </span>
                </p>
              </div>
            </div>
          }
        </ol>
      </body>
    </div>
  );
}
