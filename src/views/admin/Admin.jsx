import {
  Avatar,
  Badge,
  Text,
  ScrollArea,
  Flex,
  Modal,
  Button,
  Input,
} from "@mantine/core";
import { Trash } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth";
import { admin } from "../../api/GET";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { updateUserStatus } from "../../api/UPDATE";
import { deleteUser } from "../../api/DELETE";

export function Admin() {
  const [opened, { open, close }] = useDisclosure(false);
  const { darkmode } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setusers] = useState([]);
  const [currentuser, setcurrentuser] = useState(null);
  const [search, setsearch] = useState("");
  useEffect(() => {
    const getallusers = async () => {
      await admin()
        .then((res) => {
          setusers(res.data.allusers);
        })
        .catch(() => {
          navigate("/");
        });
    };
    getallusers();
  }, []);
  const handleuserstatus = async (userId) => {
    await updateUserStatus(userId)
      .then((res) => {
        console.log(res.data);
        setusers((prev) => {
          return prev.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                status: res.data.status,
              };
            }
            return user;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleuserdelete = async (userId) => {
    await deleteUser(userId)
      .then(() => {
        setusers((prev) => {
          return prev.filter((user) => {
            return user.id !== userId;
          });
        });
      })
      .catch((err) => {});
  };
  return (
    <div
      style={{
        backgroundColor: darkmode ? "#18191A" : "white",
        maxWidth: "960px",
        margin: "0 auto",
        marginTop: "0.5rem",
      }}
    >
      <ScrollArea>
        <div
          style={{
            padding: "1rem",
          }}
        >
          <Input
            value={search}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
            placeholder="Search"
          />
        </div>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {users
            ?.filter((user) => {
              if (user.username.toLowerCase().includes(search.toLowerCase())) {
                return user;
              } else {
                return null;
              }
            })
            .map((user) => {
              return (
                <Flex
                  justify={"space-between"}
                  key={user.username}
                  gap={"lg"}
                  align={"center"}
                  style={{
                    paddingBottom: "1rem ",
                    borderBottom: darkmode
                      ? "1px solid #303030"
                      : "1px solid #ccc",
                  }}
                >
                  <Flex
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/${user.username}`);
                    }}
                    align={"center"}
                    gap={"md"}
                  >
                    <Avatar size={30} src={user.avatar} radius={30} />
                    <Text weight={600} color={darkmode ? "white" : "black"}>
                      {user.username}
                    </Text>
                  </Flex>
                  <Badge
                    onClick={() => {
                      handleuserstatus(user.id);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    color={
                      user.status === "active"
                        ? "green"
                        : user.status === "inactive"
                        ? "red"
                        : "blue"
                    }
                  >
                    {user.status}
                  </Badge>

                  <Trash
                    cursor={"pointer"}
                    onClick={() => {
                      open();
                      setcurrentuser(user.id);
                    }}
                    size="1.2rem"
                    color="red"
                    weight="fill"
                  />
                </Flex>
              );
            })}
        </div>
      </ScrollArea>
      <Modal
        style={{ zIndex: 999 }}
        opened={opened}
        onClose={close}
        title="Are u sure u want to delete this user?"
      >
        <Flex justify={"flex-end"} gap={"md"}>
          <Button
            onClick={() => {
              handleuserdelete(currentuser);
              close();
            }}
            color="red"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
    </div>
  );
}
