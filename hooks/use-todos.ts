"use client"

import { useEffect, useState } from "react"

export type Priority = "high" | "normal" | "low"
export type Category = "업무" | "개인" | "쇼핑"

export type Todo = {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: number
  dueDate?: string
  category?: Category
}

const STORAGE_KEY = "todos"

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setTodos(JSON.parse(stored))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos, isLoaded])

  function addTodo(text: string, priority: Priority = "normal", dueDate?: string, category?: Category) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
      category: category || undefined,
    }
    setTodos((prev) => [todo, ...prev])
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function editTodo(id: string, text: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    )
  }

  return { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo }
}
