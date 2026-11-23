import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from './models/task';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  tasks: Task[] = [];

  newTaskTitle: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Récupérer les tâches
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches', err);
      }
    });
  }

  // Ajouter une tâche
  addTask(): void {
    if (this.newTaskTitle.trim() === '') {
      return;
    }

    const task: Task = {
      title: this.newTaskTitle,
      completed: false
    };

    this.taskService.addTask(task).subscribe({
      next: (newTask) => {
        this.tasks.unshift(newTask);
        this.newTaskTitle = '';
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout', err);
      }
    });
  }

  // Changer le statut
  toggleTask(task: Task): void {
    if (!task._id) {
      return;
    }

    const updatedTask: Partial<Task> = {
      completed: !task.completed
    };

    this.taskService.updateTask(task._id, updatedTask).subscribe({
      next: (updatedTask) => {
        task.completed = updatedTask.completed;
      },
      error: (err) => {
        console.error('Erreur lors de la modification', err);
      }
    });
  }

  // Supprimer une tâche
  deleteTask(task: Task): void {
    if (!task._id) {
      return;
    }

    this.taskService.deleteTask(task._id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== task._id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }
}