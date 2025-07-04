# Графы: типовые задачи и алгоритмы по категориям

## 1. Ориентированный граф

| Тип задачи                              | Применяемый алгоритм          |
| :-------------------------------------- | :---------------------------- |
| Проверка связности                      | DFS или BFS                   |
| Поиск цикла                             | DFS с recStack                |
| Топологическая сортировка               | DFS + стек / Kahn's Algorithm |
| Нахождение компонент сильной связности  | Алгоритм Косарайю или Тарьяна |
| Нахождение кратчайшего пути (без весов) | BFS                           |
| Нахождение кратчайшего пути (с весами)  | Дейкстра / Беллман-Форд       |
| Поиск всех путей между двумя вершинами  | DFS с возвратом назад         |

## 2. Неориентированный граф

| Тип задачи                               | Применяемый алгоритм                 |
| :--------------------------------------- | :----------------------------------- |
| Проверка связности                       | DFS или BFS                          |
| Поиск цикла                              | DFS с родителем (не идти в родителя) |
| Нахождение мостов                        | Алгоритм Тарьяна                     |
| Нахождение точек сочленения              | Алгоритм Тарьяна                     |
| Нахождение минимального остовного дерева | Крускал или Прим                     |
| Проверка двудольности                    | BFS с покраской                      |
| Нахождение эйлерова цикла                | Алгоритм Флёри                       |
| Поиск всех путей между двумя вершинами   | DFS с возвратом назад                |

## 3. Взвешенный граф

| Тип задачи                                    | Применяемый алгоритм |
| :-------------------------------------------- | :------------------- |
| Кратчайший путь (все веса \u2265 0)           | Дейкстра             |
| Кратчайший путь (возможны отрицательные веса) | Беллман-Форд         |
| Нахождение минимального остовного дерева      | Крускал или Прим     |

## 4. Невзвешенный граф

| Тип задачи                               | Применяемый алгоритм |
| :--------------------------------------- | :------------------- |
| Кратчайший путь                          | BFS                  |
| Проверка связности                       | DFS или BFS          |
| Поиск цикла                              | DFS                  |
| Топологическая сортировка (если это DAG) | DFS или Kahn         |
| Проверка двудольности                    | BFS с покраской      |

---

### Замечания

- Если не сказано про веса, **считаем граф невзвешенным**.
- Если веса могут быть отрицательными, **Дейкстра не подходит**, нужен Беллман-Форд.
- В неориентированном графе при поиске цикла важно проверять возврат **не в родителя**.
- Топологическая сортировка работает только для **DAG** (Directed Acyclic Graph).

---

> Готово к быстрому повторению перед собеседованием!
