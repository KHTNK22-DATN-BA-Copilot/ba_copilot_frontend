import useSWR from "swr"

const fetcher = async (url: string, { arg }: { arg: any }) => {
    return fetch(`${window.location.origin}/api${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(arg)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok')
            }
            return res.json()
        })
}
export const useWireframe = (wireframe_id: string) => {
    const { data, error, isLoading } = useSWR(['/wireframe-generate/template', wireframe_id], 
        ([url, wid]) => fetcher(url, { arg: { wireframe_id: wid } })
    );
    return { data, error, isLoading };
}