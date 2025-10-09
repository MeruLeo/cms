"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { AlertCircle, CheckCircle2, Info, Trash2, XCircle } from "lucide-react";

type ModalType = "info" | "success" | "warning" | "danger" | "delete";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  loading?: boolean;
}

const iconMap: Record<ModalType, JSX.Element> = {
  info: <Info className="text-blue" size={40} />,
  success: <CheckCircle2 className="text-green" size={40} />,
  warning: <AlertCircle className="text-yellow" size={40} />,
  danger: <XCircle className="text-red" size={40} />,
  delete: <Trash2 className="text-red" size={40} />,
};

const colorMap: Record<ModalType, string> = {
  info: "primary",
  success: "success",
  warning: "warning",
  danger: "danger",
  delete: "danger",
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  loading = false,
}) => {
  const icon = iconMap[type];
  const color = colorMap[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="rounded-4xl">
      <ModalContent>
        <ModalHeader className="flex bg-gray4 flex-col items-center gap-2 text-center">
          <span className="bg-red-950 p-2 rounded-2xl">{icon}</span>
          <span className="text-xl">{title}</span>
        </ModalHeader>
        <ModalBody className="text-center text-gray">{description}</ModalBody>
        <ModalFooter className="flex justify-center gap-3">
          <Button variant="flat" fullWidth onPress={onClose}>
            {cancelText}
          </Button>
          <Button
            color={color as any}
            fullWidth
            onPress={onConfirm}
            isLoading={loading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
