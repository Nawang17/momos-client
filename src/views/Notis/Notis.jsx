import { Popover, Text, ActionIcon } from "@mantine/core";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";

import { Bell } from "phosphor-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notis } from "../../api/GET";
export default function Notis() {
  const formatDistanceLocale = {
    lessThanXSeconds: "{{count}}s",
    xSeconds: "{{count}}s",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}m",
    xMonths: "{{count}}m",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
  };

  function formatDistance(token, count, options) {
    options = options || {};

    const result = formatDistanceLocale[token].replace("{{count}}", count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }

    return result;
  }
  const [opened, setOpened] = useState(false);
  const [Notis, setnotis] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    notis()
      .then((res) => {
        setnotis(res.data.notis);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [opened]);
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={300}
      position="bottom"
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon onClick={() => setOpened((o) => !o)}>
          <Bell size={28} color="black" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <div>
          <Text size={"sm"} weight="bold">
            Notifications
          </Text>
          {Notis.map((data) => {
            return (
              <div
                onClick={() => {
                  setOpened(false);
                }}
                key={data.id}
                style={{
                  display: "flex",
                  paddingTop: "10px",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <img
                    onClick={() => {
                      navigate(`/${data.user.username}`);
                    }}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                    }}
                    src={data.user.avatar}
                    alt=""
                  />
                  <div
                    onClick={() => {
                      navigate(`/post/${data.postId}`);
                    }}
                  >
                    {" "}
                    {data.type === "COMMENT" && (
                      <Text size="14px">
                        <span style={{ fontWeight: "500" }}>
                          {" "}
                          {`
              ${data.user.username} 
`}
                        </span>
                        {`
             commented: ${data.text} 
`}
                      </Text>
                    )}
                    {data.type === "LIKE" && (
                      <Text size="14px">
                        <span style={{ fontWeight: "500" }}>
                          {" "}
                          {`
              ${data.user.username} 
`}
                        </span>
                        {`
            ${data.text} 
`}
                      </Text>
                    )}
                  </div>

                  <Text color={"dimmed"} size="14px">
                    {formatDistanceToNowStrict(new Date(data.createdAt), {
                      locale: {
                        ...locale,
                        formatDistance,
                      },
                    })}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
