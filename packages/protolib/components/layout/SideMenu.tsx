import React from 'react'
import { YStack, useMedia, Button, Square, XStack, TooltipSimple } from '@my/ui'
import { useState } from 'react'
import { PanelLeftOpen, PanelLeftClose, PanelLeft, Globe } from '@tamagui/lucide-icons'
import { SiteConfig } from '@my/config/dist/AppConfig'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ColorToggleButton } from '../../components/ColorToggleButton'
import { SessionLogoutButton } from '../../components/SessionLogoutButton'
import { isElectron } from '../../lib/isElectron'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const CollapsedSideMenuAtom = atomWithStorage('collapsedSideMenu', false)

export const SideMenu = ({ sideBarColor = '$background', children, themeSwitcher = true, tintSwitcher = true, ...props }: any) => {
    const isXs = useMedia().xs
    const [open, setOpen] = useState(false)
    const [collapsed, setCollapsed] = useAtom(CollapsedSideMenuAtom)
    const width = collapsed ? 80 : 260

    const settingsTintSwitcher = SiteConfig.ui?.tintSwitcher
    const settingsThemeSwitcher = SiteConfig.ui?.themeSwitcher

    const settingsTintSwitcherEnabled = settingsTintSwitcher === undefined ? true : settingsTintSwitcher
    const settingsThemeSwitcherEnabled = settingsTintSwitcher === undefined ? true : settingsThemeSwitcher

    return <YStack bw={0} bc={sideBarColor} {...props} onDoubleClick={e => { setCollapsed(!collapsed); e.stopPropagation() }}>
        <YStack
            animateOnly={["width"]}
            // @ts-ignore
            animation="quick"
            width={width}
            height="0"
            flex={1}
            overflow={"hidden"}
            $sm={{
                position: 'absolute',
                zIndex: 100,
                height: '100%',
                backgroundColor: "$backgroundStrong",
                display: open ? 'flex' : 'none',
            }}
            style={{ overflowY: 'auto' }}
        >
            {props.logo && <YStack l="$5" t="$5" pos="absolute" display={props.collapsedLogo && collapsed ? 'none' : 'flex'}>
                {props.logo}
            </YStack>}
            {props.collapsedLogo && <YStack l="$5" t="$5" pos="absolute" display={collapsed && props.collapsedLogo ? 'flex' : 'none'}>
                {props.collapsedLogo}
            </YStack>}
            {React.cloneElement(children, { ...children.props, collapsed })}
        </YStack>
        <XStack jc={collapsed ? "center" : "space-between"} m="$4" ai="center">
            {(tintSwitcher || themeSwitcher) &&
                <XStack display={collapsed ? "none" : "flex"}>
                    {themeSwitcher && settingsThemeSwitcherEnabled && <ThemeToggle borderWidth={0} chromeless />}
                    {tintSwitcher && settingsTintSwitcherEnabled && <ColorToggleButton borderWidth={0} chromeless />}
                    {!isElectron() && <SessionLogoutButton borderWidth={0} chromeless />}
                    {isElectron() && <TooltipSimple
                        groupId="header-actions-theme"
                        label={`Open with browser`}
                    >
                        <Button
                            size="$3"
                            chromeless
                            onPress={() => window['electronAPI'].openExternal("http://localhost:8000")}
                            aria-label="Toggle light/dark color scheme"
                            icon={Globe}
                            scaleIcon={1.3}
                            color="$gray9"
                        >
                        </Button>
                    </TooltipSimple>}
                </XStack>
            }
            <YStack
                onPress={() => setCollapsed(!collapsed)}
                p="$2"
                als={collapsed ? "center" : "flex-end"}
                cursor='pointer'
                hoverStyle={{ backgroundColor: '$gray4' }}
                br="$4"
            >
                {/* @ts-ignore */}
                <Square animation="quick" rotate={collapsed ? '180deg' : '0deg'}>
                    <PanelLeft size={19} color="$gray9" />
                </Square>
            </YStack>
        </XStack>
        {
            isXs && <>
                <YStack
                    backgroundColor="$background"
                    h="100%"
                    width='100vw'
                    display={open ? 'flex' : 'none'}
                    onPress={e => {
                        setOpen(false)
                        e.stopPropagation()
                    }}
                ></YStack>

                <Button
                    onPress={() => setOpen(!open)}
                    position="fixed"
                    zIndex={99999}
                    left="16px"
                    top="15px"
                    icon={open ? PanelLeftClose : PanelLeftOpen}
                    scaleIcon={1.5}
                    size="$3"
                    backgroundColor="transparent"
                    circular
                >
                </Button>
            </>
        }
    </YStack >
}