import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { toast } from "sonner";
import { mutate } from "swr";

import http from "@/lib/http";

export default function App() {
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget),
      data = Object.fromEntries(formData.entries());

    try {
      await http.post("/channels", data);
      toast.success("Channel created successfully");
      mutate("/channels");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget),
      data = Object.fromEntries(formData.entries());

    try {
      await http.post(`/channels/${data.name}/join`);
      toast.success("Channel joined successfully");
      mutate("/channels");
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <div className="container my-10 grid gap-3">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Create Room</h2>
        </CardHeader>
        <CardBody>
          <form className="grid gap-3" onSubmit={handleCreate}>
            <Input
              isRequired
              label="Name"
              name="name"
              placeholder="Channel name"
              type="text"
            />

            <Button color="primary" type="submit">
              Create
            </Button>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Join Room</h2>
        </CardHeader>
        <CardBody>
          <form className="grid gap-3" onSubmit={handleJoin}>
            <Input
              isRequired
              label="Name"
              name="name"
              placeholder="Channel name"
              type="text"
            />

            <Button color="primary" type="submit">
              Join
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
