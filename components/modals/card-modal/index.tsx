import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UseCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Header from "./header";
import Description from "./description";
import Actions from "./actions";
import { AuditLog } from "@prisma/client";
import Activity from "./activity";

const CardModal = () => {
  const id = UseCardModal((state) => state.id);
  const isOpen = UseCardModal((state) => state.isOpen);
  const onClose = UseCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  });

  console.log(auditLogsData, "auditLogsData")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        </DialogTitle>
        <DialogDescription asChild>
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                {!cardData ? (
                  <Description.Skeleton />
                ) : (
                  <Description data={cardData} />
                )}
                {!auditLogsData ? <Activity.Skeleton /> : <Activity items={auditLogsData} />}
              </div>
            </div>
            {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
