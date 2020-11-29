import { syncWithCodeBeamer, onAllWidgetsLoaded } from "main"
import { createOrHideSettingsWidget, isSelectionConvertable } from "components/utils";
import { submitNewCodeBeamerItem } from "components/codebeamer";

const UPLOAD_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 20C16 19.4477 16.4477 19 17 19H20V4H4V19H7C7.55228 19 8 19.4477 8 20C8 20.5523 7.55228 21 7 21H3C2.44772 21 2 20.5523 2 20V3C2 2.44772 2.44772 2 3 2H21C21.5523 2 22 2.44771 22 3V20C22 20.5523 21.5523 21 21 21H17C16.4477 21 16 20.5523 16 20Z" fill="#050038"/><path d="M11 21.5V11.9142L9.41421 13.5C9.02369 13.8905 8.39052 13.8905 8 13.5C7.60948 13.1095 7.60948 12.4763 8 12.0858L12 8.08579L16 12.0858C16.3905 12.4763 16.3905 13.1095 16 13.5C15.6095 13.8905 14.9763 13.8905 14.5858 13.5L13 11.9142V21.5C13 22.0523 12.5523 22.5 12 22.5C11.4477 22.5 11 22.0523 11 21.5Z" fill="#050038"/></svg>'
// TODO: Check if should be unused
// const OPEN_ITEM_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5V17H20V14C20 13.4477 20.4477 13 21 13C21.5523 13 22 13.4477 22 14V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V5C2 3.89543 2.89543 3 4 3H11C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5H4Z" fill="#050038"/><path d="M20.0093 6.40496L20 8.99643C19.998 9.54871 20.4442 9.99802 20.9964 9.99999C21.5487 10.002 21.998 9.55585 22 9.00357L22.0214 3H16C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H18.5858L12.2929 11.2929C11.9024 11.6834 11.9024 12.3166 12.2929 12.7071C12.6834 13.0976 13.3166 13.0976 13.7071 12.7071L20.0093 6.40496Z" fill="#050038"/><path d="M6 21C6 20.4477 6.44772 20 7 20H17C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22H7C6.44771 22 6 21.5523 6 21Z" fill="#050038"/></svg>'
const CODEBEAMER_ICON = '<svg enable-background="new 0 0 256 256" version="1.1" viewBox="0 0 256 256" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#050038"><path class="st0" d="M128,255c70.1,0,127-56.9,127-127S198.1,1,128,1S1,57.9,1,128S57.9,255,128,255"/><path class="st1" d="m142.7 103.9c1.4 12.6 2.6 29.3 21.5 18.5 0.5-0.2 0.9-0.5 1.2-0.7 4.5-6.7-0.2-20.9 5.1-20 5.9 1-1.2 7.6 1.8 12.7 3.1-2.1 3.6-11 7.9-8.3 4.2 2.6-3.4 5.6-3.7 8.9 2.7 1.4 10.4-6 11.4-0.7 0.9 4-9.3 3.4-10.3 5.4 2.1 3.3 12.7 0.7 10.1 6-2.2 4.4-9.4-3.3-13.6-2 1.2 3.7 8.9 4.4 5.7 8-2.9 3.3-6.8-2.5-11.7-7.1-0.6 0.7-1.2 1.4-1.9 2.1-11.9 11.9-26 8.9-33.2-3.5-3.5-6-3.3-9.7-4.3-16.2-1.3 4-2.2 7.8-2.6 11.6-10.5 9.2-19.8 19.1-22.8 34.2 7-5.5 13.6-13.1 20.4-9.8 6.4 3.1 11.4 12.6 13.6 20.2 6.1-2.8 11.2-5.8 12.8-1.6 1.9 5.3-6.8 2.8-9.6 6.4 4 3.1 15.1-2.4 15.7 3.3 0.7 6.9-9.9-0.4-13.6 2.4 0.3 2.6 11.6 6.1 9.1 10.1-3.4 5.3-8.9-5.9-12.3-5.6-1.1 3.8 5.9 10.1 0.3 11.3-5.9 1.2-2.7-8.7-5.2-12.3-5.4 4.2-0.3 14.4-7.2 13.1-6-1.2 4-13.8 2.9-23-2.8-3.3-5.9-6.5-8.9-5.4-6.3 2.5-6.7 9.3-17.9 13.6 8.8 17 33.4 33.9 57.1 32.4 21.4-1.4 46-18.3 36.6-55.5-1.2-4.7-1-6.5 2.1-0.7 14.2 26.8-4.8 72.1-54.3 66.8-58.6-6.2-63.2-56.8-81.2-61.2-4-1-8.1 3.1-11.7 6.2 0.4 8.3 5.1 17.8-0.4 18.4-5.2 0.6-1-6.8-3.7-10.1-3.7 2.9-1.1 14.3-6.5 13.5-6.4-0.9 2.6-8.9 0.8-12.8-2.5-0.3-8.1 9.2-11.2 6-4.2-4.3 7.3-6.7 7.7-9.9-3.2-1.8-10.6 3.2-10.4-2.2 0.2-5.5 8.5-0.5 12.4-2-2.7-5.9-13.1-3.5-10.4-9.5 1.8-3.9 7.4 1.8 13.8 5.3 2-8.1 11.3-21.4 18-21.9 5.4-0.4 9.9 4.1 14.4 8.9-0.2-2.6-0.2-5.2-0.1-7.9 0.5-24.5 9.5-46.2 44.9-61.1 1.4-10.4-9.9-13.4-8-20.8 1.6-5.7 9.5-10.9 16.3-12.7-2.9-5.5-6.5-10.2-2.8-11.9 4.4-2 2.8 5.7 6.1 7.8 2.4-3.6-3-12.7 1.9-13.6 5.8-1 0.2 8.4 2.9 11.4 2.2-0.4 4.4-10.3 8-8.4 4.8 2.6-4.5 7.9-3.9 10.8 3.3 0.7 8.2-5.7 9.6-1 1.4 4.9-7.3 2.8-10.2 5.2 3.9 4.4 12.3-0.5 11.6 5.4-0.6 4.9-10.8-1.8-18.5-1.2-3.3 2.5-7.2 6.1-7 9.4 0.3 5 6.7 9 10.6 13.4 7.4-3.2 6.6-10.9 12-13.8 20-11 51.4 6.3 51.6 14.9 0.1 8.2-17.3 19.7-32.1 23.2-3.5 0.8-6.1-0.5-8.4-1.8-8.8-5.3-11.7 3.1-18.3 9.4" fill="#FFFFFF"/></svg>'

miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'CodeBeamer Sync',
        svgIcon: CODEBEAMER_ICON,
        onClick: syncWithCodeBeamer,
      },
      toolbar: {
        title: "codeBeamer<->Miro Settings",
        librarySvgIcon: CODEBEAMER_ICON,
        toolbarSvgIcon: CODEBEAMER_ICON,
        onClick: async () => {
          let returnval = await miro.board.ui.openModal('src/settings.html')
          console.log(JSON.stringify(returnval))
        },
      },
      getWidgetMenuItems: function (selectedWidgets) {
        var menuItems: SDK.IWidgetMenuItem[] = []
        if (isSelectionConvertable(selectedWidgets))
          menuItems.push(
            {
              tooltip: "Convert to codeBeamer Item",
              svgIcon: UPLOAD_ICON,
              onClick: () => submitNewCodeBeamerItem(selectedWidgets[0]),
            })
        // if (isSelectionOpenable(selectedWidgets))
        //   menuItems.push(
        //     {
        //       tooltip: "Open in CodeBeamer",
        //       svgIcon: OPEN_ITEM_ICON,
        //       onClick: () => openInCodeBeamer(selectedWidgets),
        //     })
        return Promise.resolve(menuItems);
      },
    }
  });

  onAllWidgetsLoaded(async () => {
    let settingsWidget = await createOrHideSettingsWidget()
    console.log(`codebeamer-miro settings are now hidden: ${settingsWidget.id}`)
  })
})