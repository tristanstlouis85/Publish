import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();

    const [isAnalytics, setIsAnalytics] = useState(false);
    const [isResources, setIsResources] = useState(false);
    const [isSummary, setIsSummary] = useState(false);
    const [isSalesDevelopment, setIsSalesDevelopment] = useState(false);
    const [isNewSales, setIsNewSales] = useState(false);
    const [isAccountManagement, setIsAccountManagement] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Analytics');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Analytics') {
            setIsAnalytics(false);
        }
        if (iscurrentState !== 'Resources') {
            setIsResources(false);
        }
        if (iscurrentState !== 'Summary') {
            setIsSummary(false);
        }
        if (iscurrentState !== 'Sales Development') {
            setIsSalesDevelopment(false);
        }
        if (iscurrentState === 'Territory') {
            history("/territory-mapping");
            document.body.classList.add('twocolumn-panel');
        }

    }, [
        history,
        iscurrentState,
        isAnalytics,
        isResources,
        isSummary
    ]);

    const menuItems = [
        {
            id: "analytics",
            label: "Analytics",
            icon: "ri-dashboard-2-line",
            link: "/#",
            stateVariables: isAnalytics,
            click: function (e) {
                e.preventDefault();
                setIsAnalytics(!isAnalytics);
                setIscurrentState('Analytics');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "summary",
                    label: "Summary",
                    link: "/summary",
                    parentId: "analytics",
                    // click: function (e) {
                    //     e.preventDefault();
                    //     setIsSummary(!isSummary);
                    // },
                    // stateVariables: isSummary,
                },
                {
                    id: "pipeline",
                    label: "Pipeline",
                    link: "/pipeline",
                    parentId: "analytics",
                    click: function (e) {
                        e.preventDefault();
                        setIsSummary(!isSummary);
                    },
                    stateVariables: isSummary,
                },
                {
                    id: "efficiency",
                    label: "Efficiency",
                    link: "/efficiency",
                    parentId: "analytics",
                    click: function (e) {
                        e.preventDefault();
                        setIsSummary(!isSummary);
                    },
                    stateVariables: isSummary,
                },
            ],
        },
        {
            id: "territory-mapping",
            label: "Territory Mapping",
            icon: "bx bx-world",
            link: "/territory-mapping",
            click: function (e) {
                e.preventDefault();
                setIscurrentState('Territory');
            },
        },

        {
            id: "pipeline-coverage",
            label: "Pipeline Coverage",
            icon: "mdi mdi-heart-pulse",
            link: "/pipelinecoverage",
            click: function (e) {
                e.preventDefault();
                setIscurrentState('Territory');
            },
        },

        {
            id: "integrations",
            label: "Integrations",
            icon: "mdi mdi-connection",
            link: "/integrations",
            click: function (e) {
                e.preventDefault();
                setIscurrentState('Territory');
            },
        },
        
        {
            id: "resources",
            label: "Resources",
            icon: "bx bx-help-circle",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsResources(!isResources);
                setIscurrentState('Resources');
                updateIconSidebar(e);
            },
            stateVariables: isResources,
            subItems: [
                                {
                    id: "support",
                    label: "Support",
                    link: "/Help",
                    parentId: "resources",
                }
            ]
        },
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;