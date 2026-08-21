# Módulo de Grupos - Guía de Uso

## Estructura del Módulo

### 1. Página Principal (`/groups`)

#### Componentes:
- **GroupGrid**: Muestra los grupos en formato grid
- **TaskGrid**: Muestra las tareas en formato grid
- **GroupForm**: Modal para crear nuevos grupos
- **DeleteModal**: Confirmación de eliminación

#### Funcionalidades:
- Pestañas para cambiar entre vista de Grupos y Tareas
- Botón "Crear Grupo" que abre modal
- Listar todos los grupos del usuario
- Eliminar grupos
- Ver tareas asociadas

### 2. Página de Detalle (`/groups/[id]`)

#### Componentes:
- **GroupDetail**: Muestra información del grupo
- **GroupMemberManager**: Gestor de miembros

#### Funcionalidades:
- Ver información completa del grupo
- Listar miembros del grupo
- Agregar nuevos miembros
- Eliminar miembros del grupo

## Estados y Datos

### Hook `useGroups`

Proporciona:
- `groups`: Array de grupos
- `selectedGroup`: Grupo actualmente seleccionado
- `groupMembers`: Miembros del grupo seleccionado
- `allUsers`: Todos los usuarios de la plataforma
- `loading`: Estado de carga
- `error`: Mensaje de error

Métodos:
- `fetchGroups()`: Obtiene todos los grupos
- `fetchGroup(id)`: Obtiene un grupo específico
- `fetchAllUsers()`: Obtiene todos los usuarios
- `createGroup(data)`: Crea un nuevo grupo
- `addUserToGroup(userId, groupId)`: Agrega usuario al grupo
- `removeUserFromGroup(userId, groupId)`: Elimina usuario del grupo
- `deleteGroup(id)`: Elimina un grupo

## Estilos

Todos los estilos están en `src/components/groups/groups.module.css`:
- Responsive grid layout
- Modal con overlay
- Formularios validados
- Transiciones suaves
- Modo móvil adaptado

## Rutas Disponibles

- `/groups` - Listado de grupos y tareas
- `/groups/[id]` - Detalle del grupo

## Validaciones

### Crear Grupo
- Nombre requerido
- Descripción requerida
- Ambos campos deben tener contenido

### Agregar Miembro
- Solo se pueden agregar usuarios no miembros del grupo
- La lista de usuarios disponibles se actualiza automáticamente

## Integración con Backend

Utiliza los siguientes endpoints (a través de services):

**GroupService:**
- `GET /groups` - Obtener grupos del usuario
- `GET /groups/{id}` - Obtener detalle del grupo
- `POST /groups` - Crear grupo
- `POST /groups/{groupId}/add_user/{userId}` - Agregar usuario
- `DELETE /groups/{groupId}/remove_user/{userId}` - Eliminar usuario
- `DELETE /groups/{id}` - Eliminar grupo

**UserService:**
- `GET /users` - Obtener todos los usuarios

**TaskService:**
- `GET /tasks/{groupId}` - Obtener tareas del grupo
- `DELETE /tasks/{id}` - Eliminar tarea

## Próximos Pasos (Opcionales)

1. Implementar gestor de tareas (crear, editar, eliminar tareas dentro de grupos)
2. Agregar roles a miembros del grupo
3. Implementar permisos por grupo
4. Agregar búsqueda y filtrado de grupos
5. Agregar paginación para listas grandes
