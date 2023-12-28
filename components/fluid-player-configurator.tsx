import { useState } from "react";
import { FormMenu } from "./form-menu";
import { transformFluidPlayerConfiguration } from "@/helpers/client";
import { ConfiguratorOptions } from "@/models";
import { formMenuItems } from "@/constants";

export function FluidPlayerConfigurator({
  onSave,
}: {
  configuration: ConfiguratorOptions;
  onSave: (newOptions: Partial<ConfiguratorOptions>) => void;
}) {
  const [openedMenu, setOpenedMenu] = useState(formMenuItems[0].key);

  /**
   * Changes selected menu if there is no form errors
   */
  function handleChangeMenu({ key }: { key: string }) {
    setOpenedMenu(key);
  }

  /**
   * Handles saving and disabling the dirty form state
   */
  function handleSave(options: Partial<ConfiguratorOptions>) {
    onSave({ ...options, playerConfiguration: transformFluidPlayerConfiguration(options?.playerConfiguration || {}) });
  }

  const { FormComponent } = formMenuItems.find((menuItem) => menuItem.key === openedMenu) || {};

  return (
    <div className="grid grid-cols-[minmax(160px,_1fr)_3fr] gap-2">
      <FormMenu onMenuChange={handleChangeMenu} onSave={handleSave} selectedItem={openedMenu} />
      {FormComponent && (
        <FormComponent onSave={handleSave} />
      )}
    </div>
  );
}
