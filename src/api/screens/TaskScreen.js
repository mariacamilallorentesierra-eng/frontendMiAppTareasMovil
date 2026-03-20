const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = React.useState([]);

    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }  
    }, [userToken]);

    const fetchTasks = async () => {
        try {
            const data = await taskApiService.getAll(userToken);
            console.log("TAREAS:", data);

            setTasks(data.datos); // 🔥 FIX CLAVE
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tus Tareas</Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>
                            {item.titulo}
                        </Text>
                        <Text style={styles.taskDescription}>
                            {item.descripcion}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};