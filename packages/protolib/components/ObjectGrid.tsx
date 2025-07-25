import { H3, Paragraph, Stack, StackProps, XStack, YStack } from "@my/ui"
import { Grid } from './Grid';
import { EditableObject } from "./EditableObject";
import { getPendingResult } from 'protobase'
import { ItemCard } from "./ItemCard";
import { useTint } from "../lib/Tints";
import { useEffect, useRef, useState } from "react";
import { Tinted } from "./Tinted";

const GridElementCard = ({ index, data, width }) => {
    const element = data.element.data
    const modelItem = data.model.load(element)
    const tint = useTint()
    const Icon = data?.icon ?? <></>
    return data.getCard?data.getCard(element, width) :<ItemCard
        height={data.itemHeight}
        cursor={data.disableItemSelection?"default":"pointer"}
        topBarOutSideScrollArea={false}
        backgroundColor={"$bgPanel"}
        elevation={"$0"}
        hoverStyle={{...(data.disableItemSelection ? {} : { o: 0.8, backgroundColor: '$' + tint.tint + '1', elevation: "$1" })}}
        borderWidth={1}
        pointerEvents='none'
        pointerEventsControls="none"
        onPress={(e) => {
            // check upward to see if an ancestor has the class "is_DialogContent" and if so, do not call onSelectItem

            if (data.disableItemSelection) return

            console.log("onPress", e.target, e.currentTarget, e)
            const dialogContent = e.target.closest('.is_DialogContent')
            if (dialogContent) return
            
            data.onSelectItem(modelItem)
        }}
        {...(data.getPicture ? {
            image: data.getPicture(element, width),
            hasPicture: true
        } : {})}
    >
        {data.getBody ? data.getBody(element, width) :
            <Stack mb={"$4"} key={element.key} width={width}>
                <EditableObject
                    initialData={data.element}
                    name={modelItem.getId()}
                    spinnerSize={75}
                    loadingText={<YStack ai="center" jc="center">Loading data...<Paragraph fontWeight={"bold"}></Paragraph></YStack>}
                    objectId={modelItem.getId()}
                    sourceUrl={data.sourceUrl + '/' + modelItem.getId()}
                    mode={'preview'}
                    model={data.model}
                    extraFields={data.extraFields}
                    icons={data.icons}
                    customFields={data.customFields}
                    columnWidth={width - data.contentMargin}
                    onDelete={data.onDelete}
                    deleteable={data.deleteable}
                    extraMenuActions={data.extraMenuActions}
                    title={<XStack mt="$4" ml={"$4"} ai="center">
                        {data?.icon && <Stack mr="$2"><Tinted><Icon color="var(--color7)" /></Tinted></Stack>}<H3>{data?.name}</H3>
                    </XStack>}
                />
            </Stack>
        }
    </ItemCard>
}

export const ObjectGrid = ({ 
        overScanBy=5, 
        gridElementCard = undefined, 
        itemMinWidth = 400, 
        emptyMessage = <></>,
        itemHeight, 
        rightGap = 30, 
        contentMargin = 50, 
        onSelectItem = (id) => { }, 
        disableItemSelection = false,
        extraMenuActions, 
        spacing = 20, 
        getPicture, 
        getBody,
        getCard, 
        model, 
        items, 
        sourceUrl, 
        customFields, 
        onDelete, 
        deleteable, 
        extraFields, 
        icons, 
        children,
        name,
        icon,
        ...props 
    }: any & StackProps) => {

    const containerRef = useRef(null)

    const data = items.map((element, i) => {
        return {
            id: 'item_' + i,
            element: getPendingResult("loaded", element),
            model,
            sourceUrl,
            customFields,
            extraFields,
            icons,
            itemMinWidth,
            getPicture,
            getBody,
            getCard,
            spacing,
            contentMargin,
            onSelectItem,
            onDelete,
            deleteable,
            itemHeight,
            extraMenuActions,
            disableItemSelection,
            name,
            icon
        }
    })

    const [ready, setReady] = useState(0)
    useEffect(() => {
        setReady(1)
    }, [])

    return <Stack f={1} o={ready?1:0} ref={containerRef} {...props}>
        <Stack mt={"$-7"} >
        {data && data.length > 0 ? <Grid
            overScanBy={overScanBy} 
            key={data.length + ready} 
            rightGap={rightGap}
            containerRef={containerRef}
            spacing={spacing}
            data={data}
            card={gridElementCard??GridElementCard} itemMinWidth={itemMinWidth}
        /> : emptyMessage}
        {children}
        </Stack>
    </Stack>
}