import { CaretDownFill } from "@styled-icons/bootstrap";
import { useState } from "react";
import c from "./shortMenu.module.css";
import { useTranslation } from "react-i18next";

export default function ShortMenu({ update }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const data = [
    { name: t("Default"), id: "db" },
    { name: t("Newest"), id: "db" },
    { name: t("Oldest"), id: "da" },
    { name: t("Price_low_to_high"), id: "pa" },
    { name: t("Price_high_to_low"), id: "pb" },
    { name: t("Name_A-Z"), id: "na" },
    { name: t("Name_Z-A"), id: "nb" },
  ];
  const [selected, setSelected] = useState(data[0]);

  function changeItem(item) {
    setShow(false);
    setSelected(item);
    update(item.id);
  }

  return (
    <div className={c.menu} onClick={() => setShow(!show)}>
      <div>{selected.name}</div>
      <CaretDownFill width={10} height={10} />
      {show && (
        <ul>
          {data.map((item, idx) => (
            <li key={idx} onClick={() => changeItem(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
