"use client";
import Accordion from "@/components/Accordion";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PiTextTBold } from "react-icons/pi";
import { FaRegImage } from "react-icons/fa6";
import { BsSlashLg } from "react-icons/bs";
import { MdOutlineRectangle } from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from "@/components/Button";
import FontPicker from "@/components/FontPicker";
import axios from "@/axios";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";

const bgImgs = [
    "https://d8it4huxumps7.cloudfront.net/images/certificate-bg.png",
    "https://d3030h7whein66.cloudfront.net/Images/Associations/IDA/bg-DRL-Certificate.png",
    "https://certifier-production-amplify.s3.eu-west-1.amazonaws.com/public/35704807-5db8-4db6-8e01-eaa6b9e463b5%2Fcertificate-designs%2Fbackgrounds%2F30-01-2023-11%3A13%3A01_technical_BG.jpg",
    "https://printyourdesign.eu/wp-content/uploads/2022/03/certificate-01-bg.jpg",
];

const inputTypes = {
    fontSize: {
        type: "number",
    },
    fontWeight: {
        type: "select",
        options: [
            {
                label: "Normal",
                value: "normal",
            },
            {
                label: "Bold",
                value: "bold",
            },
            {
                label: "Bolder",
                value: "bolder",
            },
            {
                label: "Lighter",
                value: "lighter",
            },
            {
                label: "100",
                value: "100",
            },
            {
                label: "200",
                value: "200",
            },
            {
                label: "300",
                value: "300",
            },
            {
                label: "400",
                value: "400",
            },
            {
                label: "500",
                value: "500",
            },
            {
                label: "600",
                value: "600",
            },
        ],
    },
    textAlign: {
        type: "select",
        options: [
            {
                label: "Left",
                value: "left",
            },
            {
                label: "Center",
                value: "center",
            },
            {
                label: "Right",
                value: "right",
            },
            {
                label: "Justify",
                value: "justify",
            },
        ],
    },
    borderRadius: {
        type: "number",
    },
    background: {
        type: "color",
    },
    color: {
        type: "color",
    },
};

const defaultAssets = {
    text: {
        type: "text",
        component: "div",
        value: "Enter Text",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Open Sans_300",
        textAlign: "left",
        width: 100,
        height: 100,
        left: 20,
        top: 10,
        background: "transparent",
        backgroundOpacity: 0,
        borderRadius: 0,
        color: "#111",
        colorOpacity: 1,
        textDecoration: "none",
    },
    img: {
        type: "image",
        component: "img",
        src: "",
        width: 400,
        height: 400,
        left: 20,
        top: 10,
    },
    rect: {
        background: "red",
        value: null,
    },
    line: {
        type: "shape",
        component: "div",
        width: 100,
        height: 2,
        top: 10,
        left: 20,
    },
};

function Builder() {

    const {user} = useUserContext()

    const [bgImages, setBgImages] = useState(bgImgs);
    const [bgImage, setBgImage] = useState(bgImgs[0]);
    const [bgSize, setBgSize] = useState("cover");
    const [width, setWidth] = useState(1056);
    const [height, setHeight] = useState(747);
    const [scale, setScale] = useState(1);

    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [imgAssets, setImgAssets] = useState([]);

    const [isDragging, setIsDragging] = useState(false);
    const [targetCoords, setTargetCoords] = useState(null);

    const imgAssetRef = useRef();

    const handleMouseDown = useCallback(
        (e) => {
            console.log(e.target);
            const id = e.target.id;
            if (id === "certificate") {
                setSelectedAsset(null);
                return;
            }
            const targetIsAnchor = id.includes("anchor");
            if (targetIsAnchor || id === selectedAsset) {
                setIsDragging(true);
                const t = assets.find((a) => a.id === selectedAsset);
                setTargetCoords({
                    anchor: id,
                    top: t.top,
                    left: t.left,
                    width: t.width,
                    height: t.height,
                    clientX: e.clientX,
                    clientY: e.clientY,
                });
            }
        },
        [assets, selectedAsset]
    );

    const handleMouseUp = useCallback((e) => {
        setIsDragging(false);
        setTargetCoords(null);
    }, []);

    const handleMouseMove = useCallback(
        (e) => {
            if (isDragging) {
                console.log(e);
                const { top, left, width, height, anchor } = targetCoords;
                switch (anchor) {
                    case selectedAsset:
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        left:
                                            targetCoords.left +
                                            (e.clientX - targetCoords.clientX),
                                        top:
                                            targetCoords.top +
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "top_left_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        top:
                                            targetCoords.top +
                                            (e.clientY - targetCoords.clientY),
                                        left:
                                            targetCoords.left +
                                            (e.clientX - targetCoords.clientX),
                                        width:
                                            targetCoords.width -
                                            (e.clientX - targetCoords.clientX),
                                        height:
                                            targetCoords.height -
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "top_right_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        top:
                                            targetCoords.top +
                                            (e.clientY - targetCoords.clientY),
                                        width:
                                            targetCoords.width +
                                            (e.clientX - targetCoords.clientX),
                                        height:
                                            targetCoords.height -
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "bottom_left_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        left:
                                            targetCoords.left +
                                            (e.clientX - targetCoords.clientX),
                                        width:
                                            targetCoords.width -
                                            (e.clientX - targetCoords.clientX),
                                        height:
                                            targetCoords.height +
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "bottom_right_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        width:
                                            targetCoords.width +
                                            (e.clientX - targetCoords.clientX),
                                        height:
                                            targetCoords.height +
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "right_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        width:
                                            targetCoords.width +
                                            (e.clientX - targetCoords.clientX),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "left_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        left:
                                            targetCoords.left +
                                            (e.clientX - targetCoords.clientX),
                                        width:
                                            targetCoords.width -
                                            (e.clientX - targetCoords.clientX),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "top_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        top:
                                            targetCoords.top +
                                            (e.clientY - targetCoords.clientY),
                                        height:
                                            targetCoords.height -
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                    case "bottom_anchor":
                        setAssets((prev) => {
                            return prev.map((a) => {
                                if (a.id === selectedAsset) {
                                    return {
                                        ...a,
                                        height:
                                            targetCoords.height +
                                            (e.clientY - targetCoords.clientY),
                                    };
                                }
                                return a;
                            });
                        });
                        return;
                }
            }
        },
        [isDragging, targetCoords, selectedAsset]
    );

    useEffect(() => {
        const certificate = document.getElementById("certificate");
        certificate.addEventListener("mousedown", handleMouseDown);
        certificate.addEventListener("mouseup", handleMouseUp);
        certificate.addEventListener("mousemove", handleMouseMove);
        return () => {
            certificate.removeEventListener("mousedown", handleMouseDown);
            certificate.removeEventListener("mouseup", handleMouseUp);
            certificate.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp]);

    const handleNewImageAsset = (e) => {
        const img = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (e) => {
            const imgElement = new Image(); // Changed variable name to imgElement
            imgElement.src = e.target.result;
            imgElement.onload = () => {
                const { width, height } = imgElement;
                console.log(imgElement, width, height);
                setImgAssets((prev) => [...prev, img]);
                setAssets((prev) => [
                    ...prev,
                    {
                        ...defaultAssets.img,
                        id: nanoid(),
                        src: e.target.result,
                    },
                ]);
            };
        };
    };

    const handleAssetUpdate = (e, key) => {
        setAssets((prev) => {
            return prev.map((a) => {
                if (a.id === selectedAsset) {
                    return {
                        ...a,
                        [key]: e.target.value,
                    };
                }
                return a;
            });
        });
    };

    const handleFontChange = useCallback(
        ({ fontFamily }) => {
            console.log("font family changed", fontFamily);
            setAssets((prev) => {
                return prev.map((a) => {
                    if (a.id === selectedAsset) {
                        return {
                            ...a,
                            fontFamily,
                        };
                    }
                    return a;
                });
            });
        },
        [selectedAsset]
    );

    function getInput([key, value]) {
        console.log(key);
        const { type, ...props } = inputTypes[key];
        switch (type) {
            case "select":
                return (
                    <select
                        value={value}
                        onChange={(e) => handleAssetUpdate(e, key)}
                    >
                        {props.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        type={type}
                        {...props}
                        value={value}
                        onChange={(e) => handleAssetUpdate(e, key)}
                    />
                );
        }
    }

    const selectedAssetObj = useMemo(() => {
        return assets.find((asset) => asset.id === selectedAsset) ?? null;
    }, [assets, selectedAsset]);

    console.log("selected asset obj >>> ", selectedAssetObj);

    const handleSaveTemplate = async () => {
        const loadingToast = toast.loading('Processing...')
        const _assets = assets.map(asset => {
            if(asset.type !== 'text') return asset;
            const text = document.getElementById(asset.id).innerText
            console.log(asset.id, text);
            return {...asset, value: text}
        })
        const obj = {bg: {
            bgImage,
            width,
            height,
            bgSize
        }, assets: _assets}
        console.log('save template', obj);
        try {
            const res = await axios.post('/institution/template', {
                template: obj,
                id: user?.registration_id
            })
            console.log(res);
            toast.success('Template saved successfully')
        }
        catch(err) {
            console.log(err);
            toast.error(err?.response?.data?.message)
        }
        finally {
            toast.dismiss(loadingToast)
        }
    }

    return (
        <main className="flex-1 grid grid-cols-5 h-full max-h-[91vh] overflow-hidden">
            <aside className="border-r-[1px] border-neutral-800 flex flex-col col-span-1">
                <Accordion label={"Canvas"}>
                    <div className="certificate_card_content p-2">
                        <div>
                            <label>Width</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Height</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                    </div>
                </Accordion>
                <Accordion label={"Background"}>
                    <div className="certificate_card_content p-2">
                        {bgImages?.map((img) => (
                            <div
                                onClick={() => setBgImage(img)}
                                className={`w-full h-full object-contain overflow-hidden cursor-pointer hover:opacity-70 transition-all rounded-lg ${
                                    bgImage === img
                                        ? "outline outline-2 outline-blue-600"
                                        : ""
                                }`}
                                key={img}
                            >
                                <img className="w-full h-full" src={img} />
                            </div>
                        ))}
                        <div onClick={() => setBgImage(null)}>None</div>
                        <div className="col-span-2">
                            <label>URL</label>
                            <input
                                onChange={(e) => {
                                    setBgImages((prev) => [
                                        ...prev,
                                        e.target.value,
                                    ]);
                                    setBgImage(e.target.value);
                                }}
                                type="url"
                            />
                        </div>
                        <p className="subtext col-span-2">OR</p>
                        <div className="col-span-2">
                            <label>Image File</label>
                            <input type="file" />
                        </div>
                        <div>
                            <label>Background size</label>
                            <select
                                value={bgSize}
                                onChange={(e) => setBgSize(e.target.value)}
                            >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                            </select>
                        </div>
                    </div>
                </Accordion>
                <Accordion label={"Assets"}>
                    <div className="certificate_card_content p-2">
                        {imgAssets?.map((img) => (
                            <div
                                onClick={() => {}}
                                className={`w-full h-full object-contain overflow-hidden cursor-pointer hover:opacity-70 transition-all rounded-lg`}
                                key={img}
                            >
                                <img
                                    className="w-full h-full"
                                    src={URL.createObjectURL(img)}
                                />
                            </div>
                        ))}
                    </div>
                </Accordion>
                <div className="certificate_card_content p-2">
                    {Object.entries(
                        assets.find((asset) => asset.id === selectedAsset) ?? {}
                    )?.map((entry) => {
                        if (!inputTypes[entry[0]]) return null;
                        return (
                            <div key={`${selectedAsset} ${entry[0]}`}>
                                <label>{entry[0]}</label>
                                {getInput(entry)}
                            </div>
                        );
                    })}
                    {selectedAssetObj?.type === "text" && (
                        <FontPicker
                            initialFont={selectedAssetObj?.fontFamily}
                            onChange={handleFontChange}
                        />
                    )}
                </div>
            </aside>
            <div className="w-full col-span-4">
                <div className="w-full p-2 flex items-center border-b-[1px] border-neutral-800 text-lg">
                    <Button
                        onClick={() => {
                            setAssets((prev) => [
                                ...prev,
                                { ...defaultAssets.text, id: nanoid() },
                            ]);
                        }}
                        variant="ghost"
                        label={
                            <>
                                <PiTextTBold size={18} />
                            </>
                        }
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewImageAsset}
                        ref={imgAssetRef}
                        style={{ display: "none" }}
                    />
                    <Button
                        onClick={() => imgAssetRef?.current?.click()}
                        variant="ghost"
                        label={
                            <>
                                <FaRegImage size={18} />
                            </>
                        }
                    />
                    <Button
                        variant="ghost"
                        onClick={() =>
                            setAssets((prev) => [
                                ...prev,
                                {
                                    ...defaultAssets.text,
                                    ...defaultAssets.rect,
                                    id: nanoid(),
                                },
                            ])
                        }
                        label={<MdOutlineRectangle size={18} />}
                    />
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setAssets((prev) => [
                                ...prev,
                                {
                                    ...defaultAssets.line,
                                    ...defaultAssets.rect,
                                    id: nanoid(),
                                },
                            ]);
                        }}
                        label={<BsSlashLg size={18} />}
                    />
                    {selectedAssetObj && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setAssets((prev) => [
                                        ...prev,
                                        {
                                            ...selectedAssetObj,
                                            id: nanoid(),
                                            top: selectedAssetObj?.top + 10,
                                            left: selectedAssetObj?.left + 10,
                                        },
                                    ]);
                                }}
                                label={<IoDuplicateOutline size={18} />}
                            />
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setAssets((prev) =>
                                        prev.filter(
                                            (a) => a.id !== selectedAsset
                                        )
                                    );
                                    setSelectedAsset(null);
                                }}
                                label={<MdOutlineDeleteOutline size={18} />}
                            />
                        </>
                    )}
                    <Button className={'w-full ml-auto'} label={'Save Template'} variant="secondary" onClick={handleSaveTemplate}/>
                    {/* <input
                        type="range"
                        className="w-fit ml-auto"
                            step={0.01}
                            value={scale}
                            onChange={(e) => {
                                console.log(e);
                                setScale(+e.target.value);
                            }}
                            min={0.1}
                        max={1.5}
                    /> */}
                </div>
                <section className="relative bg-neutral-900/50 w-full h-full p-8 overflow-auto max-h-[87vh]">
                    <div
                        width={width}
                        height={height}
                        id="certificate"
                        style={{
                            backgroundImage: `url('${bgImage}')`,
                            backgroundSize: bgSize,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            width: `${width}px`,
                            height: `${height}px`,
                            scale: scale,
                        }}
                        className="bg-gray-700 w-full h-full m-auto shadow-lg"
                    >
                        <Transformer
                            assets={assets}
                            selectedAsset={selectedAsset}
                            setAssets={setAssets}
                        />
                        {assets?.map((asset) => {
                            return (
                                <Asset
                                    key={asset.id}
                                    asset={asset}
                                    selectedAsset={selectedAsset}
                                    setSelectedAsset={setSelectedAsset}
                                />
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}

const Asset = ({ asset, setSelectedAsset, selectedAsset }) => {
    const [editable, setEditable] = useState(false);
    const Component = asset.component;
    return (
        <Component
            draggable={false}
            contentEditable={asset.type === "text" && editable}
            onClick={() => {
                console.log("clicked");
                setSelectedAsset(asset.id);
            }}
            onDoubleClick={() => {
                setSelectedAsset(asset.id);
                setEditable(true);
            }}
            onBlur={() => {
                setSelectedAsset(null);
                setEditable(false);
            }}
            id={asset.id}
            className={`absolute z-[1] hover:cursor-move border-[2px] border-transparent overflow-hidden ${
                selectedAsset !== asset.id ? "hover:border-blue-500" : ""
            }`}
            style={{
                top: `${asset.top}px`,
                left: `${asset.left}px`,
                width: `${asset.width}px`,
                height: `${asset.height}px`,
                background: `${asset.background}`,
                borderRadius: `${asset.borderRadius}px`,
                textAlign: `${asset.textAlign}`,
                color: `${asset.color}`,
                fontSize: `${asset.fontSize}px`,
                fontWeight: `${asset.fontWeight}`,
                fontFamily: `${asset.fontFamily}`,
                textDecoration: `${asset.textDecoration}`,
                objectFit: "contain",
            }}
            src={asset?.src}
        >
            {asset.value}
        </Component>
    );
};

const ANCHOR_STROKE = 2;

const Transformer = ({ assets, selectedAsset, setAssets }) => {
    if (!selectedAsset) return null;
    const certificate = document.getElementById("certificate");
    const certificateBox = certificate.getBoundingClientRect();
    const selectedAssetObj = document.getElementById(selectedAsset);
    const box = selectedAssetObj?.getBoundingClientRect();
    const topAnchor = {
        left: box.left - certificateBox.left,
        top: box.top - certificateBox.top,
        width: box.width,
        height: ANCHOR_STROKE,
    };
    const leftAnchor = {
        left: box.left - certificateBox.left,
        top: box.top - certificateBox.top,
        height: box.height,
        width: ANCHOR_STROKE,
    };
    const bottomAnchor = {
        left: box.left - certificateBox.left,
        top: box.top - certificateBox.top + box.height,
        width: box.width + ANCHOR_STROKE,
        height: ANCHOR_STROKE,
    };
    const rightAnchor = {
        left: box.left - certificateBox.left + box.width,
        top: box.top - certificateBox.top,
        width: ANCHOR_STROKE,
        height: box.height,
    };
    const topLeftAnchor = {
        top: topAnchor.top,
        left: topAnchor.left,
        width: ANCHOR_STROKE * 4,
        height: ANCHOR_STROKE * 4,
    };
    const topRightAnchor = {
        top: rightAnchor.top,
        left: rightAnchor.left,
        width: ANCHOR_STROKE * 4,
        height: ANCHOR_STROKE * 4,
    };
    const bottomLeftAnchor = {
        top: bottomAnchor.top,
        left: bottomAnchor.left,
        width: ANCHOR_STROKE * 4,
        height: ANCHOR_STROKE * 4,
    };
    const bottomRightAnchor = {
        top: leftAnchor.top + box.height,
        left: leftAnchor.left + box.width,
        width: ANCHOR_STROKE * 4,
        height: ANCHOR_STROKE * 4,
    };

    return (
        <>
            {[
                { id: "top", coord: topAnchor },
                { id: "left", coord: leftAnchor },
                { id: "bottom", coord: bottomAnchor },
                { id: "right", coord: rightAnchor },
                { id: "bottom_left", coord: bottomLeftAnchor },
                { id: "bottom_right", coord: bottomRightAnchor },
                { id: "top_left", coord: topLeftAnchor },
                { id: "top_right", coord: topRightAnchor },
            ]?.map(({ id, coord: anchor }, i) => {
                const isCornerElement = id.split("_").length > 1;
                return (
                    <span
                        id={`${id}_anchor`}
                        key={i}
                        className={`${
                            isCornerElement
                                ? "bg-neutral-300 outline outline-1 outline-blue-600 rounded-full shadow-md translate-x-[-48%] translate-y-[-48%]"
                                : "bg-blue-600"
                        } z-10`}
                        style={{
                            position: "absolute",
                            left: `${anchor.left}px`,
                            top: `${anchor.top}px`,
                            width: `${anchor.width}px`,
                            height: `${anchor.height}px`,
                        }}
                    ></span>
                );
            })}
        </>
    );
};

export default Builder;
