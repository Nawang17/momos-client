import {
  Alert,
  Button,
  Flex,
  Input,
  Modal,
  Radio,
  Text,
  Textarea,
} from "@mantine/core";
import { Image, UsersThree, WarningCircle } from "phosphor-react";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth";
import { useState, useRef } from "react";
import { set } from "date-fns";
import { AddNewCommunity } from "../../api/POST";
import { getcommunities } from "../../api/GET";
import { useNavigate } from "react-router-dom";
const Createnewcommunity = () => {
  const { darkmode, UserInfo } = useContext(AuthContext);
  const [communityname, setCommunityname] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState("Public");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imagefile, setimageFile] = useState(null);
  const navigate = useNavigate();
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };
  const imgsizelimit = 9437184; //9mb
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setimageFile(file);
    if (file.size > imgsizelimit) {
      setError("Image size is too big. Max allowed size is 9MB");
    }
    setSelectedImage(URL.createObjectURL(file));
  };
  const onmodalclose = () => {
    setLoading(false);
    setError(null);
    setimageFile(null);
    setCommunityname("");
    setDescription("");
    setChecked("Public");
    setSelectedImage(null);
    close();
  };
  const handleCreateCommunity = async () => {
    setLoading(true);
    setError(null);
    const formdata = new FormData();
    formdata.append("communityname", communityname);
    formdata.append("description", description);
    formdata.append("privacy", checked);
    formdata.append("media", imagefile);

    await AddNewCommunity(formdata)
      .then((res) => {
        onmodalclose();
        navigate(`/community/${res.data.newcommunity}`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 0) {
          setError("Internal Server Error");
        } else {
          setError(err.response.data);
        }
      });
  };
  return (
    <>
      <Button
        onClick={open}
        leftIcon={<UsersThree size={18} weight="fill" />}
        my="md"
        fullWidth
        color="gray"
      >
        Create community
      </Button>

      <Modal
        zIndex={1000}
        opened={opened}
        onClose={onmodalclose}
        title="Create Community"
      >
        <Flex gap={15} direction={"column"}>
          <div
            style={{
              height: selectedImage ? "auto" : "140px",
              border: selectedImage && "none",
            }}
            className="image-uploader"
            onClick={handleImageUpload}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="uploaded-image"
              />
            ) : (
              <div className="upload-text">
                <span>
                  <Flex align={"center"} gap={5}>
                    <Image size={30} />
                    <div>Upload photo</div>
                  </Flex>
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          {error && (
            <Alert icon={<WarningCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          <Input.Wrapper
            id="Community-name"
            label="Community name"
            description="This cannot be changed later"
            error=""
          >
            <Input
              maxLength={20}
              value={communityname}
              onChange={(event) => setCommunityname(event.currentTarget.value)}
              id="Community-name"
              placeholder="Community Name"
            />
          </Input.Wrapper>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            maxLength={160}
            placeholder="Description"
            label="Description"
            minRows={3}
          />
          <Text>Privacy setting</Text>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",

              padding: "5px",
              display: "flex",
              gap: "20px",
              flexDirection: "column",
            }}
          >
            <Flex gap={10} align={"center"}>
              <Radio
                onChange={() => setChecked("Public")}
                checked={checked === "Public"}
                label="Public (Anyone can join)"
              />
            </Flex>
            <Radio
              onChange={() => setChecked("Private")}
              checked={checked === "Private"}
              label="Private (Owner approval required)"
            />
          </div>
          <Button
            loading={loading}
            disabled={communityname === "" || description === ""}
            onClick={handleCreateCommunity}
          >
            Create Community
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default Createnewcommunity;
