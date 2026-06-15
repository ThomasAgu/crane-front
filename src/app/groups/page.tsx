"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/layout/NavBar";
import Loader from "@/components/ui/Loader";
import { useAlert, AlertSnackbar } from "@/components/ui/AlertSnackbar";
import { Plus } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import GroupGrid from "@/components/groups/GroupGrid";
import GroupForm from "@/components/groups/GroupForm";
import TaskGrid from "@/components/groups/TaskGrid";
import { TaskService } from "@/lib/api/taskService";
import { TaskDto } from "@/lib/dto/TaskDto";
import DeleteModal from "@/components/ui/DeleteModal";
import styles from "@/components/groups/groups.module.css";

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "tasks">("groups");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    active: boolean;
    groupId?: number;
    taskId?: number;
    type?: "group" | "task";
  }>({ active: false });
  const [formLoading, setFormLoading] = useState(false);
  
  const {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    deleteGroup,
  } = useGroups();

  const { alertState, showAlert, handleCloseAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Get all groups first to fetch their tasks
      const allGroups = await Promise.all(
        groups.map(async (group) => {
          try {
            const groupTasks = await TaskService.getTasks(String(group.id));
            return groupTasks;
          } catch {
            return [];
          }
        })
      );
      const flatTasks = allGroups.flat();
      setTasks(flatTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  const handleCreateGroup = async (formData: any) => {
    setFormLoading(true);
    try {
      await createGroup(formData);
      setShowCreateForm(false);
      showAlert(
        "El grupo ha sido creado exitosamente.",
        "success",
        "Grupo Creado"
      );
      await fetchGroups();
    } catch (err) {
      showAlert(
        "Error al crear el grupo",
        "error",
        "Error"
      );
      console.error("Error creating group:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGroup = (id: number) => {
    setDeleteModal({
      active: true,
      groupId: id,
      type: "group",
    });
  };

  const handleDeleteTask = (id: number) => {
    setDeleteModal({
      active: true,
      taskId: id,
      type: "task",
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.type === "group" && deleteModal.groupId) {
        await deleteGroup(String(deleteModal.groupId));
        showAlert(
          "El grupo ha sido eliminado.",
          "success",
          "Grupo Eliminado"
        );
      } else if (deleteModal.type === "task" && deleteModal.taskId) {
        await TaskService.deleteTask(String(deleteModal.taskId));
        setTasks(tasks.filter(t => t.id !== deleteModal.taskId));
        showAlert(
          "La tarea ha sido eliminada.",
          "success",
          "Tarea Eliminada"
        );
      }
    } catch (err) {
      showAlert(
        "Error al eliminar",
        "error",
        "Error"
      );
      console.error("Error deleting:", err);
    } finally {
      setDeleteModal({ active: false });
    }
  };

  const getDeleteItemName = () => {
    if (deleteModal.type === "group") {
      const group = groups.find(g => g.id === deleteModal.groupId);
      return group?.name || "Grupo";
    }
    const task = tasks.find(t => t.id === deleteModal.taskId);
    return task?.name || "Tarea";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.mainContent}>
      <NavBar>
        <div className={styles.headerActions}>
          <h1 className="text-3xl font-bold mt-6 text-darkest">Grupos</h1>
          <button
            className={styles.createButton}
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} />
            Crear Grupo
          </button>
        </div>
      </NavBar>
      
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === "groups" ? styles.active : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          Grupos
        </button>
        <button
          className={`${styles.tab} ${activeTab === "tasks" ? styles.active : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tareas
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "groups" && (
          <GroupGrid
            groups={groups}
            onDelete={handleDeleteGroup}
          />
        )}
        {activeTab === "tasks" && (
          <TaskGrid
            tasks={tasks}
            onDelete={handleDeleteTask}
          />
        )}
      </div>

      {showCreateForm && (
        <GroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setShowCreateForm(false)}
          isLoading={formLoading}
        />
      )}

      {deleteModal.active && (
        <DeleteModal
          itemName={getDeleteItemName()}
          itemType={deleteModal.type === "group" ? "Grupos" : "Tareas"}
          deleteFunction={confirmDelete}
          setActive={() => setDeleteModal({ active: false })}
        />
      )}

      <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
    </main>
  );
}
