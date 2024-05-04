import axiosInstance from "@/axios";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import StatusIndicator from "@/components/StatusIndicator";
import { useUserContext } from "@/context/userContext";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdDeleteForever } from "react-icons/md";

function Profile() {
    const { user } = useUserContext();
    const [selectedSection, setSelectedSection] = useState(
        user?.isVerified ? "profile" : "verify"
    );

    const links = useMemo(() => {
        return [
            {
                label: "Profile",
                key: "profile",
                onClick: () => {
                    setSelectedSection("profile");
                },
            },
            {
                label: "Database",
                key: "db",
                onClick: () => {
                    setSelectedSection("db");
                },
            },
            {
                label: "Verify",
                key: "verify",
                onClick: () => {
                    setSelectedSection("verify");
                },
                show: !user?.isVerified,
            },
        ];
    }, [user]);

    return (
        <div className="">
            <div className="flex">
                <aside className="p-2 border-0 border-r-[1px] border-r-neutral-800 h-full max-h-[50vh] sticky top-0">
                    <ul className="flex flex-col gap-4">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    active={link.key === selectedSection}
                                    {...link}
                                />
                            </li>
                        ))}
                    </ul>
                </aside>
                <section className="flex-1 p-2 pb-4 pl-4">
                    {selectedSection === "profile" && <ProfileSection />}
                    {selectedSection === "verify" && <VerifySection />}
                    {selectedSection === "db" && <DatabaseSection />}
                </section>
            </div>
        </div>
    );
}

const Link = ({ label, active, show = true, ...props }) => {
    if (!show) return null;
    return (
        <span
            className={`text-sm ${
                active ? "text-blue-500" : "text-neutral-400 hover:text-white"
            } cursor-pointer`}
            {...props}
        >
            {label}
        </span>
    );
};

const ProfileSection = () => {
    const { user } = useUserContext();
    return (
        <main className="recipient_card">
            <h2>Institute Profile</h2>
            <div>
                <label>Institute Name</label>
                <span>{user.name}</span>
            </div>
            <div>
                <label>Institute Registration ID</label>
                <span>{user.registration_id}</span>
            </div>
            <div>
                <label>Certify ID</label>
                <Badge>{user?._id}</Badge>
            </div>
            <div>
                <label>Email</label>
                <span>
                    {user?.email}{" "}
                    <Badge>
                        <StatusIndicator
                            status={user?.isVerified ? "active" : "inactive"}
                        />{" "}
                        <span>
                            {user?.isVerified ? "Verified" : "Unverified"}
                        </span>
                    </Badge>
                </span>
            </div>
        </main>
    );
};

const VerifySection = () => {
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useUserContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = Object.fromEntries(new FormData(e.target)?.entries());
        console.log(formData);
        try {
            const res = await axiosInstance.post("/institution/verify-otp", {
                ...formData,
                email: user?.email,
            });
            console.log(res);
            if (res.status === 200) {
                toast.success("Verification Successful.");
                setUser((prev) => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.log(err);
            toast.error(`Verification Failed. ${err?.response?.data.error}`);
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="recipient_card">
            <h2>Verify Email</h2>
            <p className="subtext">
                Check your email for a six digit verification code.
            </p>
            <div>
                <label>Email</label>
                <span>{user?.email}</span>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        name="otp"
                        type="text"
                        placeholder="Enter the 6 digit verification code"
                    />
                </label>
                <Button loading={loading} type={"submit"} label={"Submit"} />
            </form>
        </main>
    );
};

const DatabaseSection = () => {
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const { user, setUser } = useUserContext();
    const [searchKeys, setSearchKeys] = useState([
        { title: null, key: null, type: "text" },
    ]);
    const [dbObj, setDbObj] = useState(null);

    useEffect(() => {
        const _tmp = async () => {
            try {
                setIsFetching(true);
                const obj = await axiosInstance.post("/institution/db", {
                    email: user?.email,
                });
                console.log(obj);
                setDbObj(obj.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsFetching(false);
            }
        };
        if (user?.email) _tmp();
    }, [user?.email]);

    console.log("dbObj", dbObj);

    useEffect(() => {
        if (dbObj) setSearchKeys(dbObj?.search_keys);
    }, [dbObj]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target)?.entries());
        formData.search_keys = searchKeys;
        console.log(formData);
        try {
            setLoading(true);
            const res = await axiosInstance.post("/institution/update/db", {
                db: formData,
                email: user?.email,
            });
            console.log(res);
            if (res.status === 200) {
                toast.success("Database updated successfully");
                setUser((prev) => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.log(err);
            toast.error(`Verification Failed. ${err?.response?.data.error}`);
        } finally {
            setLoading(false);
        }
    };
    console.log(searchKeys);

    const handleSearchKeyChange = (e, index) => {
        const key = e.target.name;
        const value = e.target.value;
        console.log(e, key, value);
        setSearchKeys((prev) => {
            return [
                ...prev.slice(0, index),
                { ...prev[index], [e.target.name]: e.target.value },
                ...prev.slice(index + 1),
            ];
        });
    };

    return (
        <main className="recipient_card">
            <h2>Add a recipient database</h2>
            <p className="subtext">
                This is aimed to simply the recipient data search process. Make
                sure you whitelist our domain in the MongoDB settings.
            </p>
            <div className="recipient_card bg-neutral-700 rounded-lg p-4">
                <span className="text-xs text-neutral-400">Note:</span>
                <p className="subtext">
                    We would require you to store the recipients blockchain
                    wallet account address to issue a certificate directly to
                    the recipients wallet and the recipient can see their
                    certificates on the platform itself.
                </p>
            </div>
            <form
                className="recipient_card space-y-2 py-2"
                onSubmit={handleSubmit}
            >
                <div>
                    <label>MongoDB Database Connection String</label>
                    <input
                        disabled={loading || isFetching}
                        required
                        defaultValue={dbObj?.db_url}
                        name="db_url"
                        type="text"
                        placeholder="Enter the database connection string"
                    />
                </div>
                <div>
                    <label>Recipient Data Collection</label>
                    <input
                        disabled={loading || isFetching}
                        required
                        defaultValue={dbObj?.recipients_data_collection_name}
                        name="recipients_data_collection_name"
                        type="text"
                        placeholder="Enter the recipient collection name"
                    />
                </div>
                <div>
                    <label className="flex flex-col gap-2 items-start text-left">
                        Search keys{" "}
                        <p className="normal-case">
                            <sup>*</sup>The keys is the collection schema for
                            which you would want to search a recipient
                        </p>
                    </label>
                    {searchKeys?.map((searchKey, index) => (
                        <div
                            key={`searchKey${index}`}
                            className="flex flex-nowrap gap-2 pt-1 items-center w-full"
                        >
                            <input
                                name="title"
                                disabled={loading || isFetching}
                                required
                                type="text"
                                value={searchKey.title}
                                onChange={(e) =>
                                    handleSearchKeyChange(e, index)
                                }
                                placeholder="Title"
                            />
                            <input
                                name="key"
                                disabled={loading || isFetching}
                                required
                                type="text"
                                value={searchKey.key}
                                onChange={(e) =>
                                    handleSearchKeyChange(e, index)
                                }
                                placeholder="Key"
                            />
                            <select
                                name="type"
                                onChange={(e) =>
                                    handleSearchKeyChange(e, index)
                                }
                            >
                                <option value="text">String</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                            </select>
                            <Button
                                disabled={
                                    loading ||
                                    isFetching ||
                                    searchKeys?.length <= 1
                                }
                                variant="neutral"
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log(index);
                                    setSearchKeys((prev) => [
                                        ...prev.slice(0, index),
                                        ...prev.slice(index + 1),
                                    ]);
                                }}
                                label={<MdDeleteForever />}
                            />
                        </div>
                    ))}
                </div>
                <Button
                    variant="neutral"
                    onClick={(e) => {
                        e.preventDefault();
                        setSearchKeys((prev) => [
                            ...prev,
                            { title: null, key: null },
                        ]);
                    }}
                    label={
                        <>
                            <MdAdd /> Add parameter
                        </>
                    }
                />
                <Button loading={loading} type={"submit"} label={"Submit"} />
            </form>
        </main>
    );
};

export default Profile;
