// AlertSnackbar.tsx
import React, { useState, useCallback } from "react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';

export type AlertSeverity = "success" | "error" | "warning" | "info";

export type AlertState = {
  open: boolean;
  message: string;
  severity: AlertSeverity;
  title: string;
};

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
    title: "",
  });

  const handleCloseAlert = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertState((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Función para activar la alerta.
   * @param message El cuerpo del mensaje.
   * @param severity El tipo de alerta (success, error, etc.).
   * @param title El título opcional de la alerta.
   */
  const showAlert = useCallback((
    message: string, 
    severity: AlertSeverity, 
    title: string = ''
  ) => {
    setAlertState({
      open: true,
      message,
      severity,
      title,
    });
  }, []);

  return { alertState, showAlert, handleCloseAlert };
};

interface AlertSnackbarProps {
  alertState: AlertState;
  handleCloseAlert: (event: React.SyntheticEvent | Event, reason?: string) => void;
  duration?: number;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

export const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  alertState,
  handleCloseAlert,
  duration = 4000,
  vertical = 'top',
  horizontal = 'center',
}) => {
  return (
    <Snackbar
      open={alertState.open}
      autoHideDuration={duration}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={handleCloseAlert}
        severity={alertState.severity}
        variant="standard"
        sx={{ width: '100%', minWidth: '300px' }}
      >
        {alertState.title && <AlertTitle>{alertState.title}</AlertTitle>}
        {alertState.message}
      </Alert>
    </Snackbar>
  );
};